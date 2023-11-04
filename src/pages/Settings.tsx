import { Button, Switch, makeStyles, shorthands } from "@fluentui/react-components";
import { BackpackRegular } from "@fluentui/react-icons";
import { fs, path } from "@tauri-apps/api";
import { open } from '@tauri-apps/api/dialog';
import toml from "toml";

const useStyles = makeStyles({
    items: {
        ...shorthands.margin([ "10px", "5px" ])
    }
})

function Settings(props: any) {
    let {notification, setNotification, setInv, inv} = props;

    async function onChange(e: any) {
        setNotification(e.target.checked);        
        let pat: string = await path.join(await path.appDataDir(), "data.toml");
        if (!(await fs.exists(await path.appDataDir()))) await fs.createDir(await path.appDataDir());
        if (!(await fs.exists(pat))) {
            await fs.writeFile(pat, "money=0\ninv_path=\"\"\nnotification=true");
        }

        let data = await fs.readTextFile(pat);
        let tomlData = toml.parse(data);
        tomlData.notification = e.target.checked;
        await fs.writeFile(pat, `money=${tomlData.money}\ninv_path="${tomlData.inv_path.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"\nnotification=${tomlData.notification}`);
    }

    const styles = useStyles();

    async function changeInv() {
        let selected = await open({
            multiple: false,
            filters: [{
                name: "JSON",
                extensions: ["json"]
            }]
        });

        if (Array.isArray(selected)) return;
        if (selected === null) return;
        let pat: string = await path.join(await path.appDataDir(), "data.toml");
        if (!(await fs.exists(await path.appDataDir()))) await fs.createDir(await path.appDataDir());
        if (!(await fs.exists(pat))) {
            await fs.writeFile(pat, "money=0\ninv_path=\"\"\nnotification=true");
        }

        let data = await fs.readTextFile(pat);
        let tomlData = toml.parse(data);
        tomlData.inv_path = selected.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        await fs.writeFile(pat, `money=${tomlData.money}\ninv_path="${tomlData.inv_path}"\nnotification=${tomlData.notification}`);
        setInv(selected)
    }

    return (
        <div className="settings" role="tabpanel">
            <Button icon={<BackpackRegular />} onClick={changeInv} className={styles.items}>Chemin de l'inventaire: {inv.replace(/\\/g, "/")}</Button> <br />
            <Switch label="Recevoir des notifications" onChange={onChange} checked={notification} className={styles.items} />
        </div>
    )
}

export default Settings;
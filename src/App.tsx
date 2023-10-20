import {Button, makeStyles, shorthands, Tab, TabList} from "@fluentui/react-components";
import { MoneyRegular, TimerRegular } from "@fluentui/react-icons";
import {fs, path} from "@tauri-apps/api";
import {useEffect, useState} from "react";
import toml from "toml";

const useStyles = makeStyles({
    root: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    indicator: {
        position: "absolute",
        top: "0",
        right: "0",
        ...shorthands.margin(["10px", "5px"]),
    },
    button_indicator: {
        ...shorthands.margin(["2px", "2px"])
    }
})

function App() {
    const styles = useStyles();
    const [money, setMoney] = useState(0);

    // @ts-ignore
    useEffect(async () => {
        let pat: string = await path.join(await path.appDataDir(), "data.toml");
        if (!(await fs.exists(await path.appDataDir()))) await fs.createDir(await path.appDataDir());
        if (!(await fs.exists(pat))) {
            await fs.writeFile(pat, "money=0\ntimestamp=0\ninv_path=\"\"");
        }

        async function refreshMoney() {
                let pat: string = await path.join(await path.appDataDir(), "data.toml"),
                data = toml.parse(await fs.readTextFile(pat)), coins = data.money;
            if (coins === undefined) return;
            setMoney(coins);
        }

        await refreshMoney();
    }, [])

    return (
        <div className={styles.root}>
            <TabList defaultSelectedValue="home">
                <Tab value="home">Accueil</Tab>
                <Tab value="lessons">Cours</Tab>
                <Tab value="comprehensions">Compréhensions</Tab>
                <Tab value="shop">Boutique</Tab>
                <Tab value="settings">Paramètres</Tab>
            </TabList>
            <div className={styles.indicator}>
                <Button className={styles.button_indicator} id="money" disabled icon={<MoneyRegular/>}>{money.toString()}</Button>
                <Button className={styles.button_indicator} disabled icon={<TimerRegular/>}>10</Button>
            </div>
        </div>
    );
}

export default App;

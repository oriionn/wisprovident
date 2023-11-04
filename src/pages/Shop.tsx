import {
    Button,
    Caption1,
    Card,
    CardHeader,
    makeStyles,
    Text, Toast, ToastBody, Toaster, ToastTitle,
    tokens,
    useToastController,
    useId
} from "@fluentui/react-components";
import {fs, path} from "@tauri-apps/api";
import toml from "toml";

const useStyles = makeStyles({
    cards: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridColumnGap: "225px",
        gridRowGap: "20px"
    },
    card: {
        width: "360px",
        maxWidth: "100%",
        height: "fit-content",
    },
    headerImage: {
        width: "44px",
        height: "44px",
    },
    caption: {
        color: tokens.colorNeutralForeground3,
    }
})

const items: { name: string; icon: string; price: number; id: number; }[] = [];

function register(name: string, icon: string, price: number, id: number) {
    items.push({
        name,
        icon,
        price,
        id
    })
}

register("Charbon", "coal.png", 10, 102);
register("Lingot de fer", "iron_ingot.png", 15, 101);
register("Lingot d'or", "gold_ingot.png", 20, 103);
register("Diamant", "diamond.png", 40, 104);
register("Bâton", "stick.png", 5, 105);

function Shop(props: any) {
    let styles = useStyles();
    let { money, refreshMoney, inv } = props;
    const toasterId = useId("toaster");
    const { dispatchToast } = useToastController(toasterId);

    async function buy(e: any) {
        let {id} = e.target.dataset;
        let data = items.filter(d => d.id === parseInt(id))[0];
        let {price, name} = data;
        id = data.id;

        if (money < price) return dispatchToast(<Toast>
                <ToastTitle>Erreur</ToastTitle>
                <ToastBody>Vous n'avez pas assez d'argent disponible pour acheter un {name}.</ToastBody>
            </Toast>,
            {
                intent: "error"
            }
        );

        if (!inv) return dispatchToast(<Toast>
                <ToastTitle>Erreur</ToastTitle>
                <ToastBody>Vous n'avez pas spécifié de chemin pour l'inventaire, pour le spécifier il faut aller dans
                    paramètre.</ToastBody>
            </Toast>,
            {
                intent: "error"
            }
        );

        if (!(await fs.exists(inv))) return dispatchToast(<Toast>
                <ToastTitle>Erreur</ToastTitle>
                <ToastBody>Le chemin que vous avez spécifié n'existe plus.</ToastBody>
            </Toast>,
            {
                intent: "error"
            }
        );

        if (!inv.endsWith(".json")) return dispatchToast(<Toast>
                <ToastTitle>Erreur</ToastTitle>
                <ToastBody>Le fichier que vous avez spécifié est invalide.</ToastBody>
            </Toast>,
            {
                intent: "error"
            }
        );

        // Give to the player
        let file = await fs.readTextFile(inv);
        let world = JSON.parse(file);
        let player = world.player;
        if (!player) return dispatchToast(<Toast>
                <ToastTitle>Erreur</ToastTitle>
                <ToastBody>Le fichier que vous avez spécifié est invalide.</ToastBody>
            </Toast>,
            {
                intent: "error"
            }
        );

        let inventory = player.inventory;
        // @ts-ignore
        let d = Object.entries(inventory).filter(o => o[1].id === id);
        // @ts-ignore
        d = d.filter(a => a[1].amount !== 64);
        if (d.length === 0) {
            let b = Object.keys(inventory).map(Number);
            let availableNumber = 0;
            while (b.includes(availableNumber)) {
                availableNumber++;
            }

            if (availableNumber >= 36) return dispatchToast(<Toast>
                    <ToastTitle>Erreur</ToastTitle>
                    <ToastBody>Vous n'avez plus de place dans votre inventaire.</ToastBody>
                </Toast>,
                {
                    intent: "error"
                }
            );

            inventory[availableNumber.toString()] = { amount: 1, id };
            world.player.inventory = inventory
            await fs.writeTextFile(inv, JSON.stringify(world));

            let pat: string = await path.join(await path.appDataDir(), "data.toml");
            if (!(await fs.exists(await path.appDataDir()))) await fs.createDir(await path.appDataDir());
            if (!(await fs.exists(pat))) {
                await fs.writeFile(pat, "money=0\ninv_path=\"\"\nnotification=true");
            }

            let data = await fs.readTextFile(pat);
            let tomlData = toml.parse(data);
            tomlData.money = money - price;
            await fs.writeFile(pat, `money=${tomlData.money}\ninv_path="${tomlData.inv_path}"\nnotification=${tomlData.notification}`);
            await refreshMoney()

            return dispatchToast(<Toast>
                    <ToastTitle>Achat</ToastTitle>
                    <ToastBody>Vous venez d'acheter un {name} pour {price}$.</ToastBody>
                </Toast>,
                {
                    intent: "success"
                }
            );
        } else {
            inventory[d[0][0]].amount += 1
            world.player.inventory = inventory
            await fs.writeTextFile(inv, JSON.stringify(world));

            let pat: string = await path.join(await path.appDataDir(), "data.toml");
            if (!(await fs.exists(await path.appDataDir()))) await fs.createDir(await path.appDataDir());
            if (!(await fs.exists(pat))) {
                await fs.writeFile(pat, "money=0\ninv_path=\"\"\nnotification=true");
            }

            let data = await fs.readTextFile(pat);
            let tomlData = toml.parse(data);
            tomlData.money = money - price;
            await fs.writeFile(pat, `money=${tomlData.money}\ninv_path="${tomlData.inv_path}"\nnotification=${tomlData.notification}`);
            await refreshMoney()

            return dispatchToast(<Toast>
                    <ToastTitle>Achat</ToastTitle>
                    <ToastBody>Vous venez d'acheter un {name} pour {price}$.</ToastBody>
                </Toast>,
                {
                    intent: "success"
                }
            );
        }
    }

    return (
        <div className="shop" role="tabpanel">
            <div className={styles.cards}>
                { items.map(item => <Card className={styles.card}>
                    <CardHeader
                        image={
                            <img
                                src={"/items/" + item.icon}
                                className={styles.headerImage}
                                alt={item.name}
                            />
                        }

                        header={<Text weight="semibold">{item.name}</Text>}

                        description={
                            <Caption1 className={styles.caption}>{item.price}$</Caption1>
                        }

                        action={
                            <Button appearance="primary" data-id={item.id} onClick={buy}>Acheter</Button>
                        }
                    />
                </Card>) }
            </div>

            <Toaster toasterId={toasterId} />
        </div>
    )
}

export default Shop;
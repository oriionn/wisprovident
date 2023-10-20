import {Button, makeStyles, SelectTabData, SelectTabEvent, shorthands, Tab, TabList} from "@fluentui/react-components";
import { MoneyRegular, TimerRegular } from "@fluentui/react-icons";
import {fs, path} from "@tauri-apps/api";
import { useEffect, useState} from "react";
import toml from "toml";
import Home from "./pages/Home.tsx";

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
    },
    page: {
        ...shorthands.margin(["20px", "20px"])
    }
})

function App() {
    const styles = useStyles();
    const [money, setMoney] = useState(0);
    const [page, setPage] = useState("home");
    const [timestamp, setTimestamp] = useState(0);
    const [time, setTime] = useState(0);
    const [timeAvailable, setAvailable] = useState("")
    const [start, setStart] = useState(true);

    // @ts-ignore
    useEffect(async () => {
        let pat: string = await path.join(await path.appDataDir(), "data.toml");
        if (!(await fs.exists(await path.appDataDir()))) await fs.createDir(await path.appDataDir());
        if (!(await fs.exists(pat))) {
            await fs.writeFile(pat, "money=0\ninv_path=\"\"");
        }

        async function refreshMoney() {
                let pat: string = await path.join(await path.appDataDir(), "data.toml"),
                data = toml.parse(await fs.readTextFile(pat)), coins = data.money;
            if (coins === undefined) return;
            setMoney(coins);
        }

        await refreshMoney();
    }, [])

    function onTabSelect(_event: SelectTabEvent, data: SelectTabData) {
        // @ts-ignore
        setPage(data.value);
    }

    function calculateRemainingTime(timestamp: number, minutes: number): string {
        const now = Date.now();
        const millisecondsPerMinute = 60 * 1000;
        const millisecondsToAdd = minutes * millisecondsPerMinute;
        const remainingMilliseconds = timestamp - now + millisecondsToAdd;

        if (remainingMilliseconds <= 0) {
            return ""
        }

        const hours = Math.floor(remainingMilliseconds / (60 * 60 * 1000));
        const remainingMinutes = Math.floor((remainingMilliseconds % (60 * 60 * 1000)) / millisecondsPerMinute);

        let formattedTime = "";
        if (hours !== 0) formattedTime = `${hours}h `;
        formattedTime += `${remainingMinutes}mins`;
        return formattedTime;
    }

    useEffect(() => {
        if (calculateRemainingTime(timestamp, time) === "") return;
        setAvailable(calculateRemainingTime(timestamp, time));
        let interval = setInterval(() => {
            setAvailable(calculateRemainingTime(timestamp, time));
            if (calculateRemainingTime(timestamp, time) === "") clearInterval(interval);
        }, 1000)
    }, [timestamp]);

    return (
        <div className={styles.root}>
            <TabList defaultSelectedValue={page} onTabSelect={onTabSelect}>
                <Tab value="home">Accueil</Tab>
                <Tab value="lessons">Cours</Tab>
                <Tab value="comprehensions">Compréhensions</Tab>
                <Tab value="shop">Boutique</Tab>
                <Tab value="settings">Paramètres</Tab>
            </TabList>
            <div className={styles.indicator}>
                <Button className={styles.button_indicator} id="money" disabled icon={<MoneyRegular/>}>{money.toString()}</Button>
                {timeAvailable !== "" && <Button className={styles.button_indicator} disabled icon={<TimerRegular/>}>{timeAvailable}</Button>}
            </div>

            <div id="page" className={styles.page}>
                { page === "home" && <Home setTimestamp={setTimestamp} timestamp={timestamp} setTime={setTime} time={time} timeAvailable={timeAvailable} start={start} setStart={setStart} />}
            </div>
        </div>
    );
}

export default App;

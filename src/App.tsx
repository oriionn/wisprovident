import {
    Button,
    Card,
    CardHeader,
    makeStyles,
    SelectTabData,
    SelectTabEvent,
    shorthands,
    Tab,
    TabList,
    Toolbar, ToolbarButton,
    Text,
    Caption1
} from "@fluentui/react-components";
import { MoneyRegular, TimerRegular, DismissCircleRegular, ArrowMinimizeRegular, HomeFilled, BookOpenFilled, MusicNote2Filled, BuildingShopFilled, SettingsFilled } from "@fluentui/react-icons";
import {fs, path} from "@tauri-apps/api";
import { useEffect, useState} from "react";
import toml from "toml";
import Home from "./pages/Home.tsx";
import {appWindow, WebviewWindow} from "@tauri-apps/api/window";
import Settings from "./pages/Settings.tsx";
import { invoke } from "@tauri-apps/api/tauri";
import Lessons from "./pages/Lessons.tsx";
import Comprehensions from "./pages/Comprehensions.tsx";
import Shop from "./pages/Shop.tsx";

const useStyles = makeStyles({
    root: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    indicator: {
        position: "fixed",
        bottom: "0",
        right: "0",
        ...shorthands.margin(["10px", "5px"]),
    },
    button_indicator: {
        ...shorthands.margin(["2px", "2px"])
    },
    page: {
        ...shorthands.margin(["20px", "20px"])
    },
    toolbar: {
        position: "absolute",
        top: "0",
        right: "0",
        width: "100vw"
    },
    toolbar_items: {
        position: "absolute",
        right: "0",
        top: "0"
    },
    logo: {
        ...shorthands.borderRadius("4px"),
        width: "48px",
        height: "48px",
    },
    description: {
        ...shorthands.margin(0, 0, "12px"),
    },
    text: {
        ...shorthands.margin(0),
    },
    notification: {
        width: "283px",
        height: "133px"
    },
    notificiation_closebutton: {
        position: "absolute",
        right: "0",
        top: "0",
        marginTop: "10px",
        marginRight: "10px"
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
    const [lessons, setLessons] = useState([]);
    const [lessonInit, setLessonInit] = useState(false);
    const [isLessonOpen, setIsLessonOpen] = useState(false);
    const [actualLessonVideo, setLessonActualVideo] = useState({});
    const [comprehensions, setComprehensions] = useState([]);
    const [comprehensionInit, setComprehensionInit] = useState(false);
    const [isComprehensionOpen, setIsComprehensionOpen] = useState(false);
    const [actualComprehensionVideo, setComprehensionActualVideo] = useState({});

    async function refreshMoney() {
        let pat: string = await path.join(await path.appDataDir(), "data.toml"),
            data = toml.parse(await fs.readTextFile(pat)), coins = data.money;
        if (coins === undefined) return;
        setMoney(coins);
    }

    useEffect(() => {
        const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDarkMode) {
            Array.from(document.getElementsByClassName("fui-FluentProviderr0")).forEach(e => {
                // @ts-ignore
                e.style.setProperty("--colorNeutralBackground1", "rgba(41, 41, 41, 0.5)");
            })
            // @ts-ignore
            document.querySelector('div[dir="ltr"]').className = "";
        } else {
            Array.from(document.getElementsByClassName("fui-FluentProviderr0")).forEach(e => {
                // @ts-ignore
                e.style.setProperty("--colorNeutralBackground1", "rgba(255, 255, 255, 0.5)");
            })
            // @ts-ignore
            document.querySelector('div[dir="ltr"]').className = "";
        }
    }, [])

    // @ts-ignore
    useEffect(async () => {
        let pat: string = await path.join(await path.appDataDir(), "data.toml");
        if (!(await fs.exists(await path.appDataDir()))) await fs.createDir(await path.appDataDir());
        if (!(await fs.exists(pat))) {
            await fs.writeFile(pat, "money=0\ninv_path=\"\"\nnotification=true");
        }

        let data = await fs.readTextFile(pat);
        let tomlData = toml.parse(data);
        setInv(tomlData.inv_path)
        setNotification(tomlData.notification)
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
        let interval = setInterval(async () => {
            setAvailable(calculateRemainingTime(timestamp, time));
            if (calculateRemainingTime(timestamp, time) === "") {
                let giveMoney = 0;
                switch(time) {
                    case 15:
                        giveMoney = 10
                        break;
                    case 30:
                        giveMoney = 25;
                        break;
                    case 45:
                        giveMoney = 40;
                        break;
                    case 60:
                        giveMoney = 60;
                        break;
                    case 90:
                        giveMoney = 95;
                        break;
                }

                let pat: string = await path.join(await path.appDataDir(), "data.toml");
                if (!(await fs.exists(await path.appDataDir()))) await fs.createDir(await path.appDataDir());
                if (!(await fs.exists(pat))) {
                    await fs.writeFile(pat, "money=0\ninv_path=\"\"\nnotification=true");
                }

                let data = await fs.readTextFile(pat);
                let tomlData = toml.parse(data);
                tomlData.money += giveMoney;
                await fs.writeFile(pat, `money=${tomlData.money}\ninv_path="${tomlData.inv_path}"\nnotification=${tomlData.notification}`);
                await refreshMoney();

                const webview = new WebviewWindow('notification', {
                    url: window.location.href + '?notif=true',
                    decorations: false,
                    alwaysOnTop: true,
                    width: 300,
                    height: 150,
                    x: 20,
                    y: 20,
                    resizable: false,
                });

                await webview.once("tauri://created", async function () {
                    await invoke("play_sound");

                    setTimeout(async () => {
                        if (await webview.isClosable()) await webview.close();
                    }, 5000)
                })

                return clearInterval(interval)
            }
        }, 1000)
    }, [timestamp]);

    const [inv, setInv] = useState("");
    const [notification, setNotification] = useState(true);

    function onClickClose() {
        appWindow.close();
    }

    function onClickMinimize() {
        appWindow.minimize();
    }

    const [isNotification, setIsNotification] = useState(false);

    // @ts-ignore
    useEffect(async () => {
        let pat: string = await path.join(await path.appDataDir(), "lessons.json");
        if (!(await fs.exists(await path.appDataDir()))) await fs.createDir(await path.appDataDir());
        if (!(await fs.exists(pat))) await fs.writeFile(pat, "[]");

        setLessons(JSON.parse(await fs.readTextFile(pat)))

        pat = await path.join(await path.appDataDir(), "comprehensions.json");
        if (!(await fs.exists(await path.appDataDir()))) await fs.createDir(await path.appDataDir());
        if (!(await fs.exists(pat))) await fs.writeFile(pat, "[]");
        setComprehensions(JSON.parse(await fs.readTextFile(pat)))

        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString)
        let notif = urlParams.get("notif");
        
        if (!notif) return setIsNotification(false);

        // @ts-ignore
        if (notif === "true" || notif === true) return setIsNotification(true);
    }, [])

    async function onClickNotif() {
        let window = WebviewWindow.getByLabel('main');
        await window?.setFocus();
        await appWindow.close();
    }

    useEffect(() => {
        if (!lessonInit) return setLessonInit(true);
        async function updateLessons() {
            let pat: string = await path.join(await path.appDataDir(), "lessons.json");
            if (!(await fs.exists(await path.appDataDir()))) await fs.createDir(await path.appDataDir());
            if (!(await fs.exists(pat))) await fs.writeFile(pat, "[]");

            await fs.writeFile(pat, JSON.stringify(lessons));
        }

        updateLessons();
    }, [lessons]);

    useEffect(() => {
        if (!comprehensionInit) return setComprehensionInit(true);
        async function updateComprehensions() {
            let pat: string = await path.join(await path.appDataDir(), "comprehensions.json");
            if (!(await fs.exists(await path.appDataDir()))) await fs.createDir(await path.appDataDir());
            if (!(await fs.exists(pat))) await fs.writeFile(pat, "[]");

            await fs.writeFile(pat, JSON.stringify(comprehensions));
        }

        updateComprehensions();
    }, [comprehensions]);

    return (
        <div className={styles.root}>
            {isNotification && <>
                <section>
                    <Card className={styles.notification} onClick={onClickNotif}>
                        <CardHeader 
                            image={
                                <img
                                    className={styles.logo}
                                    src="icon.png"
                                    alt="Wisprovident"
                                />
                            }
                            header={<Text weight="semibold">Wisprovident</Text>}
                            description={<Caption1 className={styles.description}>Fin du chronomètre</Caption1>}
                        />

                        <p className={styles.text}>
                            Le chronomètre que vous avez lancé est terminé !
                        </p>

                        <Button onClick={onClickClose} className={styles.notificiation_closebutton} icon={<DismissCircleRegular />}></Button>
                    </Card>
                </section>
            </>}
            {!isNotification &&  <>
                <Toolbar data-tauri-drag-region className={styles.toolbar}>
                    <div className={styles.toolbar_items}>
                        <ToolbarButton onClick={onClickMinimize} aria-label="Minimize" icon={<ArrowMinimizeRegular />} />
                        <ToolbarButton onClick={onClickClose} aria-label="Close" icon={<DismissCircleRegular />} />
                    </div>
                </Toolbar>
                <TabList defaultSelectedValue={page} onTabSelect={onTabSelect}>
                    <Tab value="home" icon={<HomeFilled />}>Accueil</Tab>
                    <Tab value="lessons" icon={<BookOpenFilled />}>Cours</Tab>
                    <Tab value="comprehensions" icon={<MusicNote2Filled />}>Compréhensions</Tab>
                    <Tab value="shop" icon={<BuildingShopFilled />}>Boutique</Tab>
                    <Tab value="settings" icon={<SettingsFilled />}>Paramètres</Tab>
                </TabList>
                <div className={styles.indicator}>
                    <Button className={styles.button_indicator} id="money" disabled icon={<MoneyRegular/>}>{money.toString()}</Button>
                    {timeAvailable !== "" && <Button className={styles.button_indicator} disabled icon={<TimerRegular/>}>{timeAvailable}</Button>}
                </div>

                <div id="page" className={styles.page}>
                    { page === "home" && <Home setTimestamp={setTimestamp} timestamp={timestamp} setTime={setTime} time={time} timeAvailable={timeAvailable} start={start} setStart={setStart} />}
                    { page === "settings" && <Settings inv={inv} setInv={setInv} notification={notification} setNotification={setNotification} /> }
                    { page === "lessons" && <Lessons data={lessons} setData={setLessons} isOpen={isLessonOpen} setIsOpen={setIsLessonOpen} setActualVideo={setLessonActualVideo} actualVideo={actualLessonVideo} /> }
                    { page === "comprehensions" && <Comprehensions data={comprehensions} setData={setComprehensions} isOpen={isComprehensionOpen} setIsOpen={setIsComprehensionOpen} setActualVideo={setComprehensionActualVideo} actualVideo={actualComprehensionVideo} /> }
                    { page === "shop" && <Shop money={money} refreshMoney={refreshMoney} inv={inv} /> }
                </div>
            </> }
        </div>
    );
}

export default App;

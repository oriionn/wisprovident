import {Button, makeStyles, shorthands, Tab, TabList} from "@fluentui/react-components";
import { MoneyRegular, TimerRegular } from "@fluentui/react-icons";

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
            <Button className={styles.button_indicator} disabled icon={<MoneyRegular />}>10</Button>
            <Button className={styles.button_indicator} disabled icon={<TimerRegular />}>10</Button>
        </div>
    </div>
  );
}

export default App;

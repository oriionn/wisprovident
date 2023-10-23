import ReactDOM from "react-dom/client";
import App from "./App";
import {
    FluentProvider,
    teamsDarkTheme,
    teamsLightTheme,
    useThemeClassName
} from '@fluentui/react-components';
import {useEffect} from "react";

function ApplyToBody() {
    const classes = useThemeClassName();

    useEffect(() => {
        const classList = classes.split(" ");
        document.body.classList.add(...classList);

        return () => document.body.classList.remove(...classList);
    }, [classes]);

    return null;
}

const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <FluentProvider theme={isDarkMode ? teamsDarkTheme : teamsLightTheme}>
        <ApplyToBody />
        <App />
    </FluentProvider>,
);

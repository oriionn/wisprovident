import {Button, makeStyles, shorthands} from "@fluentui/react-components";
import {TimerRegular} from "@fluentui/react-icons";
import React from "react";

const useStyles = makeStyles({
    page: {
        ...shorthands.margin(["5px", "5px"])
    }
})

function Home(props: any) {
    const styles = useStyles();

    async function setTime(event: React.MouseEvent<HTMLElement>) {
        let target = event.target;
        // @ts-ignore
        // await props.setTime(parseInt(target.dataset.time));
        await props.setTime(0.01)
        await props.setTimestamp(Date.now());
        props.setStart(false);
    }

    return (
        <div className="home" role="tabpanel">
            { props.start === false && <div>
                {props.timeAvailable !== "" &&  <div>
                <Button icon={<TimerRegular/>} onClick={setTime} data-time="15" className={styles.page} disabled>15
                    minutes | 10 $</Button> <br/>
                <Button icon={<TimerRegular/>} onClick={setTime} data-time="30" className={styles.page} disabled>30
                    minutes | 25 $</Button> <br/>
                <Button icon={<TimerRegular/>} onClick={setTime} data-time="45" className={styles.page} disabled>45
                    minutes | 40 $</Button> <br/>
                <Button icon={<TimerRegular/>} onClick={setTime} data-time="60" className={styles.page} disabled>1 heure
                    | 60 $</Button> <br/>
                <Button icon={<TimerRegular/>} onClick={setTime} data-time="90" className={styles.page} disabled>1 heure
                    et demi | 95 $</Button>
                </div>
                }

                {props.timeAvailable === "" && <div>
                    <Button icon={<TimerRegular/>} onClick={setTime} data-time="15" className={styles.page}>15
                        minutes | 10 $</Button> <br/>
                    <Button icon={<TimerRegular/>} onClick={setTime} data-time="30" className={styles.page}>30
                        minutes | 25 $</Button> <br/>
                    <Button icon={<TimerRegular/>} onClick={setTime} data-time="45" className={styles.page}>45
                        minutes | 40 $</Button> <br/>
                    <Button icon={<TimerRegular/>} onClick={setTime} data-time="60" className={styles.page}>1
                        heure
                        | 60 $</Button> <br/>
                    <Button icon={<TimerRegular/>} onClick={setTime} data-time="90" className={styles.page}>1
                        heure
                        et demi | 95 $</Button>
                </div>}
            </div>
            }

            {props.start === true && <div>
                <Button icon={<TimerRegular/>} onClick={setTime} data-time="15" className={styles.page}>15
                    minutes | 10 $</Button> <br/>
                <Button icon={<TimerRegular/>} onClick={setTime} data-time="30" className={styles.page}>30
                    minutes | 25 $</Button> <br/>
                <Button icon={<TimerRegular/>} onClick={setTime} data-time="45" className={styles.page}>45
                    minutes | 40 $</Button> <br/>
                <Button icon={<TimerRegular/>} onClick={setTime} data-time="60" className={styles.page}>1
                    heure
                    | 60 $</Button> <br/>
                <Button icon={<TimerRegular/>} onClick={setTime} data-time="90" className={styles.page}>1
                    heure
                    et demi | 95 $</Button>
            </div>}
        </div>
    )
}

export default Home;
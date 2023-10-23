import {
    Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Input, Label,
    Link, makeStyles,
    Select, SelectProps,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow, Toast, Toaster, ToastTitle, useToastController
} from "@fluentui/react-components";
import {useId} from "react";
import {fs, path} from "@tauri-apps/api";

const columns = [
    { columnKey: "name", label: "Nom" },
    { columnKey: "status", label: "Statut" }
]

const useStyles = makeStyles({
    modal_content: {
        display: "flex",
        flexDirection: "column",
        rowGap: "10px",
    },
    table: {
        width: "70vw"
    }
})

// @ts-ignore
function Lessons(props) {
    const {data, setData} = props;
    const styles = useStyles();
    // @ts-ignore
    const toasterId = useId("toaster");
    const { dispatchToast } = useToastController(toasterId);

    async function updateLessons() {
        let pat: string = await path.join(await path.appDataDir(), "lessons.json");
        if (!(await fs.exists(await path.appDataDir()))) await fs.createDir(await path.appDataDir());
        if (!(await fs.exists(pat))) {
            await fs.writeFile(pat, "[]");
        }

        await fs.writeFile(pat, JSON.stringify(data));
    }

    const onChange: SelectProps["onChange"] = async (event, dataa) => {
        // @ts-ignore
        if (!event.target.dataset.id) return;
        // @ts-ignore
        const nextData = data.map((datab, index) => {
            // @ts-ignore
            if (index === parseInt(event.target.dataset.id)) {
                return {
                    ...datab,
                    status: dataa.value === "À faire" ? 0:dataa.value === "À revoir" ? 1:2
                }
            } else {
                return datab
            }
        });
        setData(nextData);
        await updateLessons();
    };

    async function createLesson() {
        let name = document.getElementById("name");
        let link = document.getElementById("link");
        if (link === null) return;
        if (name === null) return;
        // @ts-ignore
        if (!name.value) return dispatchToast(
            <Toast>
                <ToastTitle>Vous n'avez pas saisi de nom !</ToastTitle>
            </Toast>,
            { intent: "error" }
        );
        // @ts-ignore
        if (!link.value) return dispatchToast(
            <Toast>
                <ToastTitle>Vous n'avez pas saisi de lien !</ToastTitle>
            </Toast>,
            { intent: "error" }
        );

        let expressionRegex = /^(https?):\/\/[^\s/$.?#].[^\s]*$/i;
        // @ts-ignore
        if (!expressionRegex.test(link.value)) dispatchToast(
                <Toast>
                    <ToastTitle>Vous n'avez pas saisi de lien correcte !</ToastTitle>
                </Toast>,
                { intent: "error" }
            );

        setData([
            ...data,
            // @ts-ignore
            { name: name.value, link: link.value, status: 0 }
        ]);
        await updateLessons();
    }

    return (<>
        <Dialog modalType="non-modal">
            <DialogTrigger disableButtonEnhancement>
                <Button>Ajouter un cours</Button>
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Ajouter un cours</DialogTitle>
                    <DialogContent className={styles.modal_content}>
                        <Label required htmlFor={"name"}>
                            Nom du cours
                        </Label>
                        <Input required type="text" id={"name"} />
                        <Label required htmlFor={"link"}>
                            Lien du cours
                        </Label>
                        <Input required type="text" id={"link"} />
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">Close</Button>
                        </DialogTrigger>
                        <Button onClick={createLesson} appearance="primary">
                            Créer le cours
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
        <Table className={styles.table}>
            <TableHeader>
                <TableRow>
                    {columns.map((column) => (
                        <TableHeaderCell key={column.columnKey}>
                            {column.label}
                        </TableHeaderCell>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    // @ts-ignore
                    data.map((item, i) => (
                        <TableRow data-id={i} key={i}>
                            <TableCell><Link as="a" href={item.link}>{item.name}</Link></TableCell>
                            <TableCell>
                                <Select onChange={onChange} value={ item.status === 0 ? "À faire":item.status === 1 ? "À revoir":"Archivés" } data-id={i}>
                                    <option>À faire</option>
                                    <option>À revoir</option>
                                    <option>Archivés</option>
                                </Select>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
        <Toaster toasterId={toasterId} />
    </>)
}

export default Lessons;
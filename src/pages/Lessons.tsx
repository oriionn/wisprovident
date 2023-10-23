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
import { DeleteRegular } from "@fluentui/react-icons";

const columns = [
    { columnKey: "name", label: "Nom" },
    { columnKey: "status", label: "Statut" },
    { columnKey: "action", label: "Action" }
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

        if (data.length === 0) { // @ts-ignore
            setData([{ name: name.value, link: link.value, status: 0 }])
        }
        else setData([
            ...data,
            // @ts-ignore
            { name: name.value, link: link.value, status: 0 }
        ])

        // @ts-ignore
        document.getElementById("closeModal").click();
    }

    async function deleteLesson(e: any) {
        let id = e.target.dataset.id;
        // @ts-ignore
        if (!id) id = e.target.parent.dataset.id;
        if (!id) return;
        // @ts-ignore
        const nextData = data.filter((d, i) => i !== parseInt(id))
        console.log(nextData)
        setData(nextData);
    }

    // @ts-ignore
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
                            <Button appearance="secondary" id="closeModal">Close</Button>
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
                    data.map((item, i) => {
                        if (item !== undefined || !item.link) return (
                            <TableRow data-id={i} key={i}>
                                <TableCell><Link target="_tauri" as="a" href={item.link}>{item.name}</Link></TableCell>
                                <TableCell>
                                    <Select onChange={onChange} value={ item.status === 0 ? "À faire":item.status === 1 ? "À revoir":"Archivés" } data-id={i}>
                                        <option>À faire</option>
                                        <option>À revoir</option>
                                        <option>Archivés</option>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button onClick={deleteLesson} data-id={i} icon={<DeleteRegular data-id={i} />} aria-label="Supprimer" />
                                </TableCell>
                            </TableRow>
                        );
                    })
                }
            </TableBody>
        </Table>
        <Toaster toasterId={toasterId} />
    </>)
}

export default Lessons;
import { Delete, Refresh, Settings } from "@mui/icons-material"
import { FunctionComponent, useCallback, useState } from "react"
import SmallIconButton from "../../../components/SmallIconButton"
import { confirm } from "../../../confirm_prompt_alert"
import { useProject } from "../ProjectPageContext"

type FileBrowserMenuBarProps = {
    width: number
    height: number
    selectedFileNames: string[]
    onResetSelection: () => void
    onRunBatchSpikeSorting?: (filePaths: string[]) => void
}

const FileBrowserMenuBar: FunctionComponent<FileBrowserMenuBarProps> = ({ width, height, selectedFileNames, onResetSelection, onRunBatchSpikeSorting }) => {
    const {deleteFile, refreshFiles} = useProject()
    const [operating, setOperating] = useState(false)
    const handleDelete = useCallback(async () => {
        const okay = await confirm(`Are you sure you want to delete these ${selectedFileNames.length} files?`)
        if (!okay) return
        try {
            setOperating(true)
            for (const fileName of selectedFileNames) {
                await deleteFile(fileName)
            }
        }
        finally {
            setOperating(false)
            refreshFiles()
            onResetSelection()
        }
    }, [selectedFileNames, deleteFile, refreshFiles, onResetSelection])

    return (
        <div>
            {/* <SmallIconButton
                icon={<Add />}
                disabled={operating}
                title="Add a new file"
                label="Add file"
                onClick={openNewFileWindow}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
            {/* Refresh */}
            <SmallIconButton
                icon={<Refresh />}
                disabled={operating}
                title="Refresh"
                onClick={refreshFiles}
            />
            <SmallIconButton
                icon={<Delete />}
                disabled={(selectedFileNames.length === 0) || operating}
                title={selectedFileNames.length > 0 ? `Delete these ${selectedFileNames.length} files` : ''}
                onClick={handleDelete}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {
                onRunBatchSpikeSorting && (
                    <SmallIconButton
                        icon={<Settings />}
                        disabled={(selectedFileNames.length === 0) || operating}
                        title={selectedFileNames.length > 0 ? `Run spike sorting on these ${selectedFileNames.length} files` : ''}
                        onClick={() => onRunBatchSpikeSorting(selectedFileNames)}
                        label="Run spike sorting"
                    />
                )
            }
        </div>
    )
}

export default FileBrowserMenuBar
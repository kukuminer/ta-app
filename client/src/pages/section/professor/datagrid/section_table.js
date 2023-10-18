import * as React from 'react';
import { DataGrid, GridCellModes } from '@mui/x-data-grid';

export default function ProfSectionTable({ rows, columns, loading, onEditStop, idVarName }) {
    const [cellModesModel, setCellModesModel] = React.useState({});

    const handleCellClick = React.useCallback((params, event) => {
        if (!params.isEditable) {
            return;
        }

        // Ignore portal
        if (!event.currentTarget.contains(event.target)) {
            return;
        }
        console.log(params)
        setCellModesModel((prevModel) => {
            return {
                // Revert the mode of the other cells from other rows
                ...Object.keys(prevModel).reduce(
                    (acc, id) => ({
                        ...acc,
                        [id]: Object.keys(prevModel[id]).reduce(
                            (acc2, field) => ({
                                ...acc2,
                                [field]: { mode: GridCellModes.View },
                            }),
                            {},
                        ),
                    }),
                    {},
                ),
                [params.id]: {
                    // Revert the mode of other cells in the same row
                    ...Object.keys(prevModel[params.id] || {}).reduce(
                        (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
                        {},
                    ),
                    [params.field]: { mode: GridCellModes.Edit },
                },
            };
        });
    }, []);

    const handleCellModesModelChange = React.useCallback((newModel) => {
        setCellModesModel(newModel);
    }, []);

    return (
        <div className='section-application-table'>
            <DataGrid
                getRowId={(row) => row[idVarName]}
                rows={rows}
                columns={columns}
                loading={loading}
                cellModesModel={cellModesModel}
                onCellModesModelChange={handleCellModesModelChange}
                onCellClick={handleCellClick}
                onCellEditStop={onEditStop}
                // onRowEditStop={onEditStop}
                hideFooter
                disableRowSelectionOnClick
                // processRowUpdate={(newv, oldv) => console.log(newv, oldv)}
                // onProcessRowUpdateError={(e) => console.log(e)}
                getRowHeight={()=>150}
            />
        </div>
    );
}
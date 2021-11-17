/* eslint-disable no-console */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized';

const styles = theme => ({
    table: {
        fontFamily: theme.typography.fontFamily
    },
    flexContainer: {
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box"
    },
    tableRow: {
        cursor: "pointer"
    },
    tableRowHover: {
        "&:hover": {
            backgroundColor: theme.palette.grey[200]
        }
    },
    selectRow: {
        backgroundColor: '#aacadd'
    },
    tableCell: {
        flex: 1
    },
    noClick: {
        cursor: "initial"
    }
});

class MuiVirtualizedTable extends React.PureComponent {
    getRowClassName = ({ index }) => {
        const { classes, rowClassName, onRowClick, selectIndex } = this.props;

        if(index==selectIndex){
            return classNames(classes.tableRow, classes.flexContainer, rowClassName, classes.selectRow);
        }

        return classNames(classes.tableRow, classes.flexContainer, rowClassName, {
            [classes.tableRowHover]: index !== -1 && onRowClick != null,
        });
    };

    cellRenderer = ({ cellData, columnIndex = null }) => {
        const { columns, classes, rowHeight, onRowClick } = this.props;
        return (
            <TableCell
                component="div"
                className={classNames(classes.tableCell, classes.flexContainer, {
                    [classes.noClick]: onRowClick == null,
                })}
                variant="body"
                style={{ height: rowHeight }}
                align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
            >
                {cellData}
            </TableCell>
        );
    };

    headerRenderer = ({ label, columnIndex, dataKey, sortBy, sortDirection }) => {
        const { headerHeight, columns, classes, sort } = this.props;
        const direction = {
            [SortDirection.ASC]: 'asc',
            [SortDirection.DESC]: 'desc',
        };

        const inner =
            !columns[columnIndex].disableSort && sort != null ? (
                <TableSortLabel active={dataKey === sortBy} direction={direction[sortDirection]}>
                    {label}
                </TableSortLabel>
            ) : (
                label
            );

        return (
            <TableCell
                component="div"
                className={classNames(classes.tableCell, classes.flexContainer, classes.noClick)}
                variant="head"
                style={{ height: headerHeight}}
                align={columns[columnIndex].numeric || false ? 'right' : 'left'}
            >
                {inner}
            </TableCell>
        );
    };

    render() {
        const { classes, columns, ...tableProps } = this.props;
        return (
            <AutoSizer>
                {({ height, width }) => (
                    <Table
                        className={classes.table}
                        height={height}
                        width={width}
                        {...tableProps}
                        rowClassName={this.getRowClassName}
                    >
                        {columns.map(({ cellContentRenderer = null, className, dataKey, ...other }, index) => {
                            let renderer;
                            if (cellContentRenderer != null) {
                                renderer = cellRendererProps =>
                                    this.cellRenderer({
                                        cellData: cellContentRenderer(cellRendererProps),
                                        columnIndex: index,
                                    });
                            } else {
                                renderer = this.cellRenderer;
                            }

                            return (
                                <Column
                                    key={dataKey}
                                    headerRenderer={headerProps =>
                                        this.headerRenderer({
                                            ...headerProps,
                                            columnIndex: index,
                                        })
                                    }
                                    className={classNames(classes.flexContainer, className)}
                                    cellRenderer={renderer}
                                    dataKey={dataKey}
                                    {...other}
                                />
                            );
                        })}
                    </Table>
                )}
            </AutoSizer>
        );
    }
}

MuiVirtualizedTable.propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            cellContentRenderer: PropTypes.func,
            dataKey: PropTypes.string.isRequired,
            width: PropTypes.number.isRequired,
        }),
    ).isRequired,
    headerHeight: PropTypes.number,
    onRowClick: PropTypes.func,
    rowClassName: PropTypes.string,
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    sort: PropTypes.func,
};

MuiVirtualizedTable.defaultProps = {
    headerHeight: 56,
    rowHeight: 35,
};

const WrappedVirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

class MachiningGrid extends React.Component{

    /**
     *
     * @param {pows:Array.<{price:number, each:number, est:number,alternative:string }>, onSelect:function} props
     */
    constructor(props){
        super(props);

        this.state={
            rows:props.rows
        }
    }

    getData(request){
        let res = this.state.rows[request.index];
        try {
            res.each = "$"+res.each.toFixed(2);
            res.price = "$"+res.price.toFixed(2);
        }catch (e) {
            //todo: the method calls also after closing the popup, and this row has an error
        }
        return {id:request.index, ...res};
    }

    componentWillReceiveProps(newProps){
        this.setState({rows:newProps.rows});
    }


    render() {
        return (
            <Paper style={{minHeight: 200, width: '100%'}}>
                <WrappedVirtualizedTable
                    selectIndex={this.props.selectIndex}
                    rowCount={this.state.rows.length}
                    rowGetter={this.getData.bind(this)}
                    onRowClick={this.props.onSelect}
                    columns={[
                        {
                            width: 100,
                            flexGrow: 1.0,
                            label: 'Price',
                            dataKey: 'price',
                        },
                        {
                            width: 100,
                            label: 'Each',
                            dataKey: 'each',
                            numeric: true,
                        },
                        {
                            width: 250,
                            label: 'Est. Bus.Days *',
                            dataKey: 'est',
                            numeric: true,
                        },
                        // {
                        //     width: 250,
                        //     label: 'Alternative',
                        //     dataKey: 'alternative',
                        //     numeric: true,
                        // }
                    ]}
                />
            </Paper>
        );
    }
}

export default MachiningGrid;

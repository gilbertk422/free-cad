/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import { AutoSizer, Column, SortDirection, Table } from "react-virtualized";
import { connect } from "react-redux";
import CommentToMachine from "../../../../../../model/line_types/CommentToMachine";


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
  tableCell: {
    flex: 1
  },
  noClick: {
    cursor: "initial"
  }
});
class Summary extends React.PureComponent {

  getRowClassName = ({ index }) => {
    const { classes, rowClassName, onRowClick } = this.props;

    return classNames(classes.tableRow, classes.flexContainer, rowClassName, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null
    });
  };

  cellRenderer = ({ cellData, columnIndex = null }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={classNames(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={
          (columnIndex != null && columns[columnIndex].numeric) || false
            ? "right"
            : "left"
        }
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex, dataKey, sortBy, sortDirection }) => {
    const { headerHeight, columns, classes, sort } = this.props;
    const direction = {
      [SortDirection.ASC]: "asc",
      [SortDirection.DESC]: "desc"
    };

    const inner =
      !columns[columnIndex].disableSort && sort != null ? (
        <TableSortLabel
          active={dataKey === sortBy}
          direction={direction[sortDirection]}
        >
          {label}
        </TableSortLabel>
      ) : (
        label
      );

    return (
      <TableCell
        component="div"
        className={classNames(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick
        )}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? "right" : "left"}
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
            {columns.map(
              (
                { cellContentRenderer = null, className, dataKey, ...other },
                index
              ) => {
                let renderer;
                if (cellContentRenderer != null) {
                  renderer = cellRendererProps =>
                    this.cellRenderer({
                      cellData: cellContentRenderer(cellRendererProps),
                      columnIndex: index
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
                        columnIndex: index
                      })
                    }
                    style={{ textAlign: "left" }}
                    className={classNames(classes.flexContainer, className)}
                    cellRenderer={renderer}
                    dataKey={dataKey}
                    {...other}
                  />
                );
              }
            )}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

Summary.defaultProps = {
  headerHeight: 38,
  rowHeight: 32
};

const WrappedSummary = withStyles(styles)(Summary);

class ReactVirtualizedTable extends React.PureComponent {
    constructor(props){
        super(props)

        /** @type {Config} */
        let config = container.resolve('config');

        let material = config.material;
        let finishing = config.finishes;

        /** @type {User} */
        let userInfo = config.shippingRequisites;

        let fileName = app.currentDocument.fileName;
        this.state={
            filename: fileName==''?"Untitled":fileName,
            firstName:userInfo.firstName,
            lastName:userInfo.lastName,
            businessName:userInfo.businessName,
            email:userInfo.email,
            order:"Standard order",
            // originalOrder:'',
            adressLine1:userInfo.address.street,
            city:userInfo.address.city,
            state:userInfo.address.state,
            country:userInfo.address.country,
            zip:userInfo.address.zipCode,
            quantity:100,
            material:material.id==-1?'Unspecified':material.name,
            value_Z:'0.000',
            finishing:finishing==null?'Unspecified':finishing.name,
            commentToMachinist:'None',
            usedLineTypes:"Auto"
        }
    }

    componentWillMount(){
        let elements = app.currentDocument.getListSimpleElements();

        let maxZ = 0;

        if(elements.length>0) {
            maxZ = elements[0].height;
            for (let element of elements) {
                if (element.height > maxZ) {
                    maxZ = element.height;
                }
            }
            if (container.resolve('config').dimension == "Millimeters") {
                maxZ = maxZ + " mm";
            } else {
                maxZ = (maxZ / 25.4).toFixed(3) + " ''";
            }
        }
        let lineTypes = [];
        m: for(let element of elements){
            for(let lineType of lineTypes){
                if(lineType== element.lineType.label){
                    continue m;
                }
            }
            lineTypes.push(element.lineType.label);
        }
        let usedLineTypes = "";
        for(let lineType of lineTypes){
            usedLineTypes+=" "+lineType+",";
        }

        let commnetToMachinist = 'None';
        let text = elements.filter(el =>el.typeName=="Text" && el.lineType.label == "Comment to Machinist");
        if(text.length>0){
            commnetToMachinist = text.length;
        }

        /** @type {Config} */
        let config = container.resolve('config');

        let quantity = config.quantity;
        this.setState({value_Z:maxZ, usedLineTypes:usedLineTypes, commentToMachinist:commnetToMachinist, quantity:quantity});
    }

  render(){
    const used_lineTypes = localStorage.getItem('lineType');

    const data = [
      ["File name",this.state.filename],
      ["Customer", this.state.firstName + ' '+ this.state.lastName + ' '+this.state.businessName],
      ["Customer email", this.state.email],
      ["Order type", this.state.order],
      ["Shipping to",this.state.city.length>0 ?this.state.adressLine1+ ' '+this.state.city+ ' '+this.state.zip+ ' '+this.state.country:'Untitled'],
      ["Quantity", this.state.quantity],
      ["Material", this.state.material],
      ["Thickness",this.state.value_Z],
      ["Used line types", this.state.usedLineTypes],
      ["Finishing", this.state.finishing],
      ["Comments to machinist", this.state.commentToMachinist ],
     
    ];

    let id = 0;
    
    function createData(filename, untitled) {
      id += 1;
      return { id, filename, untitled };
    }
    const rows = [];
    
      for (let i = 0; i < data.length; i += 1) {
        const renderData = data[i];
        rows.push(createData(...renderData));
      }

  
  return (
    <Paper style={{ height: 400, width: "100%" }}>
      <WrappedSummary
        rowCount={rows.length}
        rowGetter={({ index }) => rows[index]}
        onRowClick={event => console.log(event, "event")}
        columns={[
          {
            width: 300,
            flexGrow: 1.0,
            // label: "File name",
            dataKey: "filename"
          },
          {
            width: 300,
            textAlign: "left",
            // label: "Untitled",
            dataKey: "untitled"
            // numeric: true,
          }
       
        ]}
      />
    </Paper>
  );
}
}

export default ReactVirtualizedTable;

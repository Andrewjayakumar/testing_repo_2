import { Format } from "../forms/table-ui/datagrid/format";

export interface IColumnOption {
  prop: any;
  name: string;
  type: string;
  controlType?: string
}
export class ExportToCsv {
  constructor() {

  }
  columnsStr: string = "";
  public GeneratecsvReport(columns: any = [], data: any[], ReportName: string) {
    var ExportColumns: IColumnOption[] = [];
    var ExportList: any[] = [];

    columns.forEach(item => {
      var exportColumn: any = { name: "", prop: "", type: "" }

      exportColumn.name = item.name;//control.placeholder;
      exportColumn.prop = item.prop;
      exportColumn.type = item.type;
      ExportColumns.push(exportColumn);
      if (this.columnsStr == "")
        this.columnsStr = exportColumn.name;
      else
        this.columnsStr = this.columnsStr + ", " + exportColumn.name;
    });

    data.forEach(item => {
      var row : any = {};
      ExportColumns.forEach(column => {
        row[column.name] = this.getValue(item, column.prop, column.type);
      });
      ExportList.push(row);

    });

    ExportColumns.unshift({ name: "S.No.", prop: "sno", type: "text" });
    this.columnsStr = "S.No., " + this.columnsStr;

    this.exporttoCSV(ExportList, ExportColumns, ReportName);
  }
  public GenerateReport(controls: any = [], columns: any = [], data: any[], ReportName: string) {
    var ExportColumns: IColumnOption[] = [];
    var ExportList: any[] = [];
    controls = controls.filter(x => x.filterresult != true);
    columns.forEach(item => {
      var exportColumn: IColumnOption = { name: "", prop: "", type: "", controlType: "" }
      var control = this.findControl(item, controls)
      exportColumn.name = control.placeholder;
      exportColumn.prop = item;
      exportColumn.type = this.getType(control.type);
      exportColumn.controlType = control.type;

      ExportColumns.push(exportColumn);
      if (this.columnsStr == "")
        this.columnsStr = exportColumn.name;
      else
        this.columnsStr = this.columnsStr + ", " + exportColumn.name;
    });

    data.forEach(item => {
      var row : any = {};
      ExportColumns.forEach(column => {
        row[column.prop] = this.getValue(item, column.prop, column.controlType);
      });
      ExportList.push(row);
    });

    ExportColumns.unshift({ name: "S.No.", prop: "sno", type: "text", controlType: "" });
    this.columnsStr = "S.No., " + this.columnsStr;

    this.exporttoCSV(ExportList, ExportColumns, ReportName);
  }
  private getType(type) {
    if (type == "date") {
      return "date";
    } else {
      return "text"
    }
  }
  private getValue(data: any, key: string, type: string) {
    if (key == "organization") {
      var node = data[key + "_node"];
      return node && node["name"] ? node["name"] : "";
    }
    else if (key == "contact") {
      var node = data[key + "_node"];
      return node && node["Firstname"] + " " + node["Lastname"];
    }
    else if (type == "dropdown" || type == "dropdown2") {
      var node = data[key + "_node"];
      return node ? node[key + "_name"] : "";
    } else {
      return data[key]
    }
  }
  /**
   * Create UI for Filter
   */
  private findControl(key: string, controls: any) {
    var _control;
    controls.forEach(control => {
      if (control.haschildren == true) {
        _control = this.findChildControl(key, control);
      }
      else {
        _control = control;
      }
    })
    return _control;
  }
  private findChildControl(key: string, control: any): any {
    if (control.haschildren == true) {
      for (let child of control.children) {
        if (child.key == key) {
          return child;
        }
        if (child.haschildren == true) {
          var _child = this.findChildControl(key, child);
          if (_child)
            return _child;
        }
      }
    }
    else if (control.key == key) {
      return control;
    }
  }
  private exporttoCSV(ExportList: any[], columns: IColumnOption[], ReportName: string) {
    let exprtcsv: any[] = [];
    var num = 1;
    (<any[]>JSON.parse(JSON.stringify(ExportList))).forEach(x => {
      var obj = new Object();
      var frmt = new Format();

      columns.forEach(column => {
        if (column.prop == 'sno') {
          x[column.name] = String(num);
          num = num + 1;
        }
        let transfrmVal = frmt.transform(x[column.name], column.type);
        obj[column.prop] = transfrmVal;
      });
      exprtcsv.push(obj);
    });
    this.downloadcsv(exprtcsv, ReportName);
  }
  private downloadcsv(data: any, exportFileName: string) {
    var csvData = this.convertToCSV(data);

    var blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, this.createFileName(exportFileName))
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", this.createFileName(exportFileName));
        //link.style = "visibility:hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  private convertToCSV(objarray: any) {
    
    var array = typeof objarray != 'object' ? JSON.parse(objarray) : objarray;

    var str = '';
    var row = "";

    for (var index in objarray[0]) {
      //Now convert each value to string and comma-separated
      row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    row = this.columnsStr;
    str += row + '\r\n';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','
        line += JSON.stringify(array[i][index]);
      }
      str += line + '\r\n';
    }

    return str;
  }

  private createFileName(exportFileName: string): string {
    var date = new Date();
    return (exportFileName +
      date.toLocaleDateString() + "_" +
      date.toLocaleTimeString()
      + '.csv')
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, AngularToastifyModule } from 'angular-toastify';
import * as XLSX from 'xlsx';
import { FileFolderServiceService } from '../services/file-folder-service.service';

@Component({
  selector: 'app-upload-excel-file',
  standalone: true,
  imports: [CommonModule,AngularToastifyModule],
  providers:[FileFolderServiceService],
  templateUrl: './upload-excel-file.component.html',
  styleUrl: './upload-excel-file.component.scss'
})
export class UploadExcelFileComponent implements OnInit {

  public uploadedDatas: any[] = [];
  public headingDatas: any[] = [];

  constructor( 
    private _fileService:FileFolderServiceService,
    private _toastService:ToastService
    ) { };

  ngOnInit(): void {

  }

  //This is the method which is used for uploading the data from excel to the angular template while fetching the all details 
  async handleSelectFile(event: any) {
    const file: File = event.target.files[0];

    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      workbook.SheetNames.forEach((sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const options = { header: 1, dateNF: 'yyyy-mm-dd' };
        this.uploadedDatas = XLSX.utils.sheet_to_json(worksheet, options);
        this.headingDatas = this.uploadedDatas.shift();
        this.uploadedDatas = this.removeFalseItem(this.uploadedDatas);
      }))
    }
    fileReader.readAsBinaryString(file);
  }


  //This is the method which is used to export the table data to the excel file 
  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('tableToExport'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
    XLSX.writeFile(wb, 'table_data.xlsx');
  }




  //removing the item from the arrays of the nestedArray whose last element value is the true and returning the value from where it is being called
  removeFalseItem = (arr: any[][]) => {
    let i = 0;
    
    while (i < arr.length) {
      let innerArray = arr[i];
      let lastItem = innerArray[innerArray.length - 1];
      let path = innerArray[innerArray.length - 2];
      let filePath = path.toString();

        if (lastItem === true) {
            arr.splice(i, 1);
            this._fileService.deleteFileFolder(filePath).subscribe({
              next:(data:any) => {
                console.log(data);
                this._toastService.success(data.message);
                
              },
              error:(error:any) => {
                console.log(error)
                this._toastService.error(error.error.message)
              }
            })
          console.log(path)
        } else {
          i++;
        }

      
    }
  
    return arr;
  }

  //Checking the type of the item whether it is number or not
  checkType(item: any) {
    let flag;
    if (typeof (item) === "number") {
      flag = true;
    } else {
      flag = false;
    }
    return flag;
  }


  //Formatting the date which is being passed from the template to this function in the form of the serial number of the date
  formateSerialNumberDate(value: any) {
    let changeDate: any;

    const startDate = new Date('1900-01-01');
    const endDate = new Date('2100-12-31');

    //Generating the serial number of the startSerialNumber and the endSerialNumber
    const startSerialNumber = (startDate.getTime() / (1000 * 60 * 60 * 24)) + 25569;
    const endSerialNumber = (endDate.getTime() / (1000 * 60 * 60 * 24)) + 25569;

    //checking the serial number of the date whether it is inside the range of the date serial number
    function isSerialDateInRange(serialDateNumber: any, start: any, end: any) {
      return serialDateNumber >= start && serialDateNumber <= end;
    }

    //checking the condition whether it is true or false
    const isInRange = isSerialDateInRange(value, startSerialNumber, endSerialNumber);
    if (isInRange) {
      changeDate = new Date((value - 25569) * 86400 * 1000);
    }

    //formatting the date in the proper way for displaying it into the template
    function formatDate(date: Date) {
      const day = String(new Date(date).getDate()).padStart(2, '0');
      const month = String(new Date(date).getMonth() + 1).padStart(2, '0');
      const year = new Date(date).getFullYear();

      return `${day}-${month}-${year}`;
    }
    let actualDate = formatDate(changeDate);
    //returning the date to the template from where it is called
    return actualDate;
  }
}

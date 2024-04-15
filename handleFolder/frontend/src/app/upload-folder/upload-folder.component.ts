import { Component, OnInit } from '@angular/core';
import { ToastService, AngularToastifyModule } from 'angular-toastify';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import $ from 'jquery';
import { HttpClientModule } from '@angular/common/http';
import { FileFolderServiceService } from '../services/file-folder-service.service';



@Component({
  selector: 'app-upload-folder',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule,AngularToastifyModule],
  providers: [FileFolderServiceService],
  templateUrl: './upload-folder.component.html',
  styleUrl: './upload-folder.component.scss'
})
export class UploadFolderComponent implements OnInit {

  isLabelDisabled: boolean = true;



  UploadedFolders: any[] = [];
  numberOfFiles: number = 0;
  numberOfFolders: number = 0;
  urlPath: any[] = [];

  loadingDatas: boolean = true;
  notLoadingDatas: boolean = false;
  loadingTemplate: boolean = true;

  inputpath: string = "";
  baseUrl: string = "";
  newBaseUrl: string = "";
  correctBasePath: string = "";
  splitedUrl: any[] = [];

  constructor(
    private _ffServices: FileFolderServiceService,
    private _tostService: ToastService
  ) { }

  ngOnInit(): void {

  }

  enableLabel() {
    this.isLabelDisabled = false;
  }

  addToArrayofSplitedUrl(name: string) {
    $('.stepBack').removeAttr('disabled');
    $('.stepBack').css('cursor','pointer');
    $('.backImageIcon').css('opacity','1');
    this.splitedUrl.push(name);
    console.log(`This is the befor adding : ${this.splitedUrl}`)
    console.log(`This is the splited url after the adding the table cell name : ${this.splitedUrl}`)
    this.newBaseUrl = this.splitedUrl.join('/')
    console.log(`This is the newBaseUrl : ${this.newBaseUrl}`)
    this.submitBasePath();
  }

  handleChange(){
    this.newBaseUrl = "";
  }

  submitBasePath() {
    if (this.newBaseUrl === "" || this.newBaseUrl === null) {
      if (this.inputpath === "" || this.inputpath === null) {
        return this._tostService.error("Please Provide the valid folder path");
      } else {
        let replacedUrl = this.inputpath.replaceAll('\\', '/');
        this.splitedUrl = replacedUrl.split('/');
        if(this.splitedUrl.length === 1){
            return this._tostService.error("Unable to access or Unknown dir.");
        }
        this.baseUrl = this.splitedUrl.join('/');
      }
      if (this.baseUrl === "D:/" || this.baseUrl === "C:/") {
        return this._tostService.error("You are unable to access due to security.")
      }
    }else{
      this.baseUrl = this.newBaseUrl
    }



    this.loadingTemplate = false;
    this.loadingDatas = true;
    this.notLoadingDatas = false;
    this._ffServices.uploadFolderPath(this.baseUrl).subscribe(
      {
        next: (data: any) => {
          console.log(data.data);
          this.UploadedFolders = data.data;
          this.correctBasePath = this.baseUrl;
          this.numberOfFiles = 0;
          this.numberOfFolders = 0;
          this.UploadedFolders.forEach((items) => {
            if(items.isDirectory === true){
              this.numberOfFolders++
            }else{
              this.numberOfFiles++
            }
          })

          this.loadingDatas = false;
          this.notLoadingDatas = true;
          this.inputpath="";
          this._tostService.success("All files and folders fetched.")
        },
        error: (error: any) => {
          console.log(`This is the error : ${error.error.error}`)
          if (error.error.error === "Error reading directorey") {
            this._tostService.error("No Such directory or Unable to access");
          }

          setTimeout(() => {
            this.loadingDatas = false;
            this.notLoadingDatas = false;
            this.loadingTemplate = true;
          }, 3000)
        }
      }
    )


  }


  oneStepBack() {
    console.log(`This is the baseUrl : ${this.baseUrl}`)
    console.log(`This is the splitedurl : ${this.splitedUrl}`)
    
    if(this.splitedUrl.length === 2){
      $('.stepBack').attr('disabled', 'disabled');
      $('.stepBack').css('cursor','context-menu');
      $('.backImageIcon').css('opacity','0.5');
      return this._tostService.error("You are unable to access due to security.")
    }else{
      this.splitedUrl.pop();
    }
    
    this.newBaseUrl = this.splitedUrl.join('/');
    this.submitBasePath();
  }


  // async handleSelectFolder(event: Event) {
  //   const inputElements = event.target as HTMLInputElement
  //   console.log(inputElements)
  //   const files = inputElements.files;
  //   console.log(files)
  //   let fileUrl;
  //   const formData = new FormData();

  //   let _url = `${this.baseUrl}/`;
  //   if (files && files.length > 0) {
  //     for (let i = 0; i < files.length; i++) {

  //       const file = files[i];
  //       fileUrl = _url + file.webkitRelativePath;

  //       formData.append('files[]', file);
  //       formData.append('fileUrl[]', fileUrl);


  //     }
  //   }

  //   this.loadingTemplate = false;
  //   this.loadingDatas = true;
  //   this.errorMsg = false;
  //   this.notLoadingDatas = false;
  //   this._ffServices.uploadArrayOfFiles(formData).subscribe({
  //     next: (data: any) => {
  //       console.log(data);
  //       this.UploadedFiles = data.data.fileDetails;
  //       // this.UploadedFolders = data.data.folderDetails;
  //       this.numberOfFiles = data.data.fileDetails.length;
  //       // this.numberOfFolders = data.data.folderDetails.length;
  //       this.loadingDatas = false;
  //       this.notLoadingDatas = true;
  //       this.errorMessage = "";
  //     },
  //     error: (error) => {
  //       console.log(error);
  //       setTimeout(() => {
  //         this.loadingDatas = false;
  //         this.errorMsg = true;
  //         // this.errorMessage = error.statusText;
  //         this.errorMessage = `${error.error.message}`
  //         this.notLoadingDatas = false;
  //       }, 2000)
  //     }
  //   })


  // }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('exportTableData'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
    XLSX.writeFile(wb, 'table_data.xlsx');
  }



}




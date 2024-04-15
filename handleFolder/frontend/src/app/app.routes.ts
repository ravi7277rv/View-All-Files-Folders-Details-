import { Routes } from '@angular/router';
import { UploadFolderComponent } from './upload-folder/upload-folder.component';
import { UploadExcelFileComponent } from './upload-excel-file/upload-excel-file.component';

export const routes: Routes = [
    { path: '', redirectTo:'uploadfolderfile', pathMatch:'full'},
    { path: 'uploadfolderfile', component: UploadFolderComponent},
    { path: 'uploadexcelfile', component: UploadExcelFileComponent}
];

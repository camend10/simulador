import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";

import { BreadcrumbsComponent } from "./breadcrumbs/breadcrumbs.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { NopagefoundComponent } from "./nopagefound/nopagefound.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

//Pipes
import { PipesModule } from "../pipes/pipes.module";
import { ModalUploadComponent } from "../components/modal-upload/modal-upload.component";

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        PipesModule
    ],
    declarations: [
        NopagefoundComponent,
        BreadcrumbsComponent,
        SidebarComponent,
        FooterComponent,
        HeaderComponent,
        ModalUploadComponent
    ],
    exports: [
        NopagefoundComponent,
        BreadcrumbsComponent,
        SidebarComponent,
        FooterComponent,
        HeaderComponent,
        ModalUploadComponent
    ]
})

export class SharedModule { }
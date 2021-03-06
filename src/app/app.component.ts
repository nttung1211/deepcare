import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Post } from './posts/Post.model';
import { FormData, FormModalService } from './services/form-modal.service';
import { Service } from './services/Service.model';
import { DataService } from './shared/data.service';
import { Flash, SubjectsService } from './shared/subjects.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Deepcare';
  // modalOpen = true;
  formTitle: string;
  formServiceId: string;
  services: Service[] = [];
  introPosts: Post[] = [];

  flashOpen = false;
  flashMessage = '';
  flashType = '';

  private formModalSubscription: Subscription;
  private serviceSubscription: Subscription;
  private introSubscription: Subscription;

  constructor(
    private formModalService: FormModalService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private introDataService: DataService<Post>,
    private servicesDataService: DataService<Service>,
    private subjectsService: SubjectsService
  ) {};

  ngOnInit() {
    // close sibar on changing route
    this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        this.subjectsService.sidebarClosed.next();
      }
    });

    // subscribe form modal toggling
    // this.formModalSubscription = this.formModalService.formModalToggled.subscribe(
    //   (formData: FormData) => {
    //     if (formData) {
    //       this.formTitle = formData.title;
    //       this.formServiceId = formData.serviceId;
    //       console.log(this.formTitle);
    //     } else {
    //       this.formTitle = 'Khám tại bệnh viện hoặc phòng khám',
    //       this.formServiceId = '5f9922d4f4a9ebe8efbb1311';
    //       console.log(this.formTitle);
    //     }

    //     this.modalOpen = !this.modalOpen;
    //   }
    // );


    // subscribe flash
    this.subjectsService.flash.subscribe(
      (flash: Flash) => {
        if (flash && flash.message && flash.type) {
          this.flashMessage = flash.message;
          this.flashType = flash.type;
          this.flashOpen = true;
        } else {
          this.flashOpen = false;
        }
      }
    );

    // fetch services
    this.spinner.show();
    this.servicesDataService.table = 'services';
    this.serviceSubscription = this.servicesDataService.all().subscribe(
      services => {
        this.servicesDataService.data.services = services;
        this.services = this.servicesDataService.data.services;
        this.spinner.hide();
      }
    );

    // fetch intro
    this.spinner.show();
    this.introDataService.table = "posts";
    this.introDataService.find('tags.name=gioithieu').subscribe(
      (posts: Post[]) => {
        this.introPosts = posts;
        this.spinner.hide();
      }
    );
  }

  setVh() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }


  ngOnDestroy() {
    this.formModalSubscription.unsubscribe();
    this.serviceSubscription.unsubscribe();
    this.introSubscription.unsubscribe();
  }
}

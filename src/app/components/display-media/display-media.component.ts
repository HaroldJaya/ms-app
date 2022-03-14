import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaService } from 'src/app/services/media.service';

const LAST_CALL_DATE = "last-call-to-service";
const POLLING_TIME = 60000;
const DATA_KEY = "last-retrived-data";
const ELEMENTS_PER_PAGE = 10;
@Component({
  selector: 'app-display-media',
  templateUrl: './display-media.component.html',
  styleUrls: ['./display-media.component.css']
})
export class DisplayMediaComponent implements OnInit, OnDestroy {
  model: MediaInfo[] = [];
  displayedData: MediaInfo[] = [];
  interval: number = 0;
  lastSuccessfullCall: number = 0;
  elementsPerPage: number = ELEMENTS_PER_PAGE;
  maxPage: number = 0;
  currentPage: number = 1;
  firstTimeout: number = 0;
  @ViewChild("search") searchBar!: ElementRef;

  constructor(private mediaService: MediaService) { }

  ngOnDestroy(): void {
    window.clearInterval(this.interval);
    window.clearInterval(this.firstTimeout);
    if (this.lastSuccessfullCall > 0) {
      window.sessionStorage.setItem(LAST_CALL_DATE, "" + this.lastSuccessfullCall);
      window.sessionStorage.setItem(DATA_KEY, JSON.stringify(this.model));
    }
  }

  ngOnInit(): void {
    let lastCallDate = window.sessionStorage.getItem(LAST_CALL_DATE);
    let firstTimeout = lastCallDate == null ? 0 : parseInt(lastCallDate) + POLLING_TIME - Date.now();
    if (firstTimeout > 0) {
      console.log("firstTimeout: ", firstTimeout)
      console.log("firstTimeout: ", lastCallDate);
      this.lastSuccessfullCall = lastCallDate == null ? 0 : parseInt(lastCallDate);
      let storedData = sessionStorage.getItem(DATA_KEY);
      this.model = !storedData ? [] : JSON.parse(storedData);
      
      this.displayedData = this.model.slice(0);

      this.maxPage = Math.ceil(this.displayedData.length / this.elementsPerPage);
      this.currentPage = this.displayedData.length > 0 ? 1 : 0;
    }
    this.firstTimeout = window.setTimeout(() => {
      this.refreshData();
      this.interval = window.setInterval(() => {
        this.refreshData();
      }, POLLING_TIME);
    }, firstTimeout);
  }

  refreshData() {
    this.mediaService.retrieveData().subscribe((data: any) => {
      if (!data){
        console.log("Call was unsuccessful, keeping current data");
        return;
      }
      this.lastSuccessfullCall = Date.now();
      console.log("retrieved data at " + this.lastSuccessfullCall);
      this.model = data;
      if (this.searchBar) {
        this.filterData(this.searchBar.nativeElement.value);
      }
      else {
        this.displayedData = this.model.slice(0);

        this.maxPage = Math.ceil(this.displayedData.length / this.elementsPerPage);
        this.currentPage = this.displayedData.length > 0 ? 1 : 0;
      }
      window.sessionStorage.setItem(LAST_CALL_DATE, "" + this.lastSuccessfullCall);
      window.sessionStorage.setItem(DATA_KEY, JSON.stringify(this.model));
    })
  }

  filterDisplayedData(filter: any): void {
    this.filterData(filter.target.value);
  }

  filterData(searchString: string) {
    this.displayedData = this.model.filter((element) => {
      return element.title ? element.title.toLowerCase().includes(searchString.toLowerCase()) : false;
    })

    this.maxPage = Math.ceil(this.displayedData.length / this.elementsPerPage);
    this.currentPage = this.displayedData.length > 0 ? 1 : 0;
  }

  paginateData(): MediaInfo[] {
    let page = this.currentPage;
    let upperbound = page * this.elementsPerPage;
    return this.displayedData.slice((page - 1) * this.elementsPerPage, ( upperbound < this.displayedData.length ? upperbound : this.displayedData.length));
  }

}

interface MediaInfo {
  title: string,
  contentType: number,
  liveStatusOnAir?: boolean,
  liveStatusRecording?: boolean,
  onDemandFileName?: string,
  onDemandEncodingDescription?: string,
  onDemandDuration?: string,
  gidEncodingProfileOnDemand?: string,
  liveMultibitrate?: boolean,
  trash?: boolean,
  hasPoster?: boolean,
  onDemandEncodingStatus?: number,
  gidProperty?: string,
  contentId?: string,
  deliveryStatus?: number,
  protectedEmbed?: boolean,
  creationDate?: string,
  updateDate?: string,
  publishDateUTC?: string,
  publishStatus?: number
}
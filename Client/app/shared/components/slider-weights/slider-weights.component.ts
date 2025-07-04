import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { SliderComponent } from 'ngx-rslide/src/app/modules/slider/slider.component';

@Component({
    selector: 'app-slider-weights',
    templateUrl: './slider-weights.component.html',
    styleUrls: ['./slider-weights.component.scss']
})
export class SliderWeightsComponent implements OnInit {

    public sliderComponent: SliderComponent;


     weightlevel = {
        "education": [25],
        "skills": [50],
        "jobtitles": [25],
         "certifications": [0]
         /**
         "industries": [12],
         "languages": [12],
        "executive": [12],
        "management": [12]**/
    };

    @Input('weights') defaultWeightsObject: Object;


    constructor(public cd: ChangeDetectorRef) { }

    ngOnInit() {
        debugger;
       if (this.defaultWeightsObject && Object.keys(this.defaultWeightsObject)) {
            this.setAllWeightageValues(this.defaultWeightsObject);
        }
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.weights) {
            this.setAllWeightageValues(this.defaultWeightsObject);
        }
    }

    SliderValueChanged(event, dimension, obj?) {
        debugger;
        this.weightlevel[dimension] = event;
       
      this.AdjustOtherWeights(dimension, event[0]);
    }

    OnSliderMouseUp( dimension) {
      //  debugger;
      
        this.AdjustOtherWeights(dimension, this.weightlevel[dimension][0]);
        this.cd.detectChanges();
    }

    setAllWeightageValues(weightage: Object) {
        let keys = Object.keys(this.weightlevel);
        keys.forEach(key => {
            this.weightlevel[key][0] = weightage[key];
        });
    }

    setIndividualweightage(dimension, value) {
      
            this.weightlevel[dimension][0] = value;
    }

    /**
     *  this method retains/preserves the latest changed weight and adjust other weights to total to a 100. 
     * @param changedweight
     */
    AdjustOtherWeights(dimension, changedweight) {
        let balance = 100 - changedweight;
        

        let keys = Object.keys(this.weightlevel);
        let otherkeys = keys.filter(x => x != dimension);


        let denom_sum = this.getSumofRemainingKeys(otherkeys);
        otherkeys.forEach(key => {
            debugger;
            let temp = JSON.parse(this.weightlevel[key][0] + "");
            if (denom_sum <= 0) {
                this.weightlevel[key][0] = balance; // handling edge case to prevent denom being 0.

            } else {
                this.weightlevel[key][0] = Math.round((balance * this.weightlevel[key][0]) / denom_sum);
            }
            balance = balance - this.weightlevel[key][0];
            denom_sum -= temp;
        });
    }

    getSumofRemainingKeys(otherkeys) {
        let sum = 0;
        otherkeys.forEach(key => {
            sum = sum + this.weightlevel[key][0];
        });
        return sum;
    }

 

   
     getWeightageDistribution() {
        let weightage = {};
        let keys = Object.keys(this.weightlevel);
        keys.forEach(key => { weightage[key] = this.weightlevel[key][0] / 100; });
        debugger;
        return weightage;
    }

}

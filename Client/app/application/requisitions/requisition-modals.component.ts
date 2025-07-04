import { Component, Type, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'rec-modal-confirm',
    template: `
  <div class="modal-header">
    <h5 class="modal-title text-primary" id="modal-title">Confirmation</h5>
    <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('cross')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <p><strong>Are you sure you want to move away from this Page?</strong></p>
    
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-primary" [hidden]="modaltype=='alert'" (click)="modal.dismiss('cancel')">Cancel</button>
    <button type="button" ngbAutofocus class="btn btn-outline-danger" (click)="modal.close('ok')">Ok</button>
  </div>
  `
})
export class NgbdModalConfirm {

  
    public static message:string = 'Are you Sure you want move away from this Page?';


    public modaltype?: string = 'confirm'; // or alert. If alert disable the Cancel button.

   
    constructor(public modal: NgbActiveModal) { }

    /*okButtonClicked(event) {
        this.okClicked.emit('OK');
    }

    setMessage(text: string, type?: string ) {
        this.message = text;
        if (type) {
            this.modaltype = type;
        }
    }*/
}

@Component({
    selector: 'rec-creation-confirm',
    template: `
  <div class="modal-header pb-1">
    <h5 id="modal-title" class="text-primary">Confirmation</h5>
    <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('Cross')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <p><strong>The Requisition is successfully created</strong></p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-primary" (click)="modal.close('createnew')">Create New</button>
    <button type="button" ngbAutofocus class="btn btn-primary" (click)="modal.close('ok')">Ok</button>
  </div>
  `
})
export class RecCreationConfirmation {
    constructor(public modal: NgbActiveModal) { }
}

export const MODALS: { [name: string]: Type<any> } = {
    confirmDialog: NgbdModalConfirm,
    recCreation: RecCreationConfirmation
};

@Component({
    selector: 'aca-popup-lt270',
    template: `
  <div class="modal-header pb-1">
    <h5 id="modal-title" class="text-primary">Benefit Summaries - Less than 270 days</h5>
    <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('Cross')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body" style="overflow-y:auto; height: 80vh">
    <p><small class="text-danger">Please note that based on various Collabera policies, the following are the only medical plan options to be provided to new employees. Employees are locked in for a 12 month period into the plan selected.
For existing employees going on a new project, do not refer to the table below. Depending on what plan they are already in, they continue in the same plan
regardless of W-2 employee type changes until their 12-month period is up.
</small></p>
<div>
<table border="1" align="center">
<tr><th align="center" class="p-2">GroupName</th><th align="center" class="w-75 p-2">Employee Type</th><th align="center" class="p-2">Document</th></tr>
<tr class="p-1">
<td class="text-center p-1"> B</td><td class="p-1"> Hourly + PTO</td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Hourly + PTO - Benefits Summary (B).pdf" target="_blank">2022</a> <a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Hourly%20+%20PTO%20-%20Benefits%20Summary%20(B)%2011.18.22.pdf" target="_blank">2023</a></td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> B</td><td class="p-1"> Hourly</td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Hourly - Benefits Summary (B).pdf" target="_blank">2022</a> <a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Hourly%20-%20Benefits%20Summary%20(B)%2011.30.22.pdf" target="_blank">2023</a></td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> B</td><td class="p-1"> Meta Hourly + Enhanced Benefit</td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion%202022%20Meta%20Hourly%20-%20Benefits Summary%20(B)%20+%20Enhanced%20Benefits%20Announcement.pdf" target="_blank">2022</a> <a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Meta%20Hourly%20-%20Benefits%20Summary%20(B)%20+%20Enhanced%20Benefits%20Announcement%2011.18.22.pdf" target="_blank">2023</a></td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> None</td><td class="p-1"> Meta Part Time </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Meta Part Time - Benefits Summary.pdf" target="_blank">2022</a> <a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Meta%20Part%20Time%20-%20Benefits%20Summary%2011.18.22.pdf" target="_blank">2023</a></td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> M</td><td class="p-1"> Microsoft Hourly </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Microsoft Hourly - Benefits Summary.pdf" target="_blank">2022</a> <a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Microsoft%20Hourly%20-%20Benefits%20Summary%2011.18.22.pdf" target="_blank">2023</a></td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> M</td><td class="p-1"> Microsoft Hourly InsVac  </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Microsoft Hourly InsVac - Benefits Summary (M).pdf" target="_blank">2022</a> <a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Microsoft%20Hourly%20InsVac%20-%20Benefits%20Summary%20(M)%2011.18.22.pdf" target="_blank">2023</a></td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> M</td><td class="p-1"> Microsoft Hourly InsVac Weekly </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Microsoft Hourly InsVac Weekly - Benefits Summary (M).pdf" target="_blank">2022</a> <a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Microsoft%20Hourly%20InsVac%20Weekly%20-%20Benefits%20Summary%20(M)%2011.18.22.pdf" target="_blank">2023</a></td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> Z</td><td class="p-1"> Weekly - Salaried PTO NonBen</td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Weekly - Hourly - Benefits Summary (Z).pdf" target="_blank">2022</a> <a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Weekly%20-%20Salaried%20PTO%20NonBen%20-%20Benefits%20Summary%20(Z)%2011.18.22.pdf" target="_blank">2023</a></td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> None</td><td class="p-1"> Part Time Employees</td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Part Time Employees - Benefit Summary.pdf" target="_blank">2022</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> S</td><td class="p-1"> Salaried Consultants</td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Salaried Consultants - Benefits Summary (S).pdf" target="_blank">2022</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> B</td><td class="p-1"> Salaried PTO NB </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Salaried PTO NB - Benefits Summary (B).pdf" target="_blank">2022</a> <a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Salaried%20PTO%20NB%20-%20Benefits%20Summary%20(B)%2011.18.22.pdf" target="_blank">2023</a></td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> None</td><td class="p-1"> Salaried Office   </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Salaried Office - Benefits Summary.pdf" target="_blank">2022</a> </td>
</tr>
    
<tr class="p-1">
<td class="text-center p-1"> B</td><td class="p-1"> Seattle Hourly </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Seattle Hourly - Benefits Summary (B).pdf" target="_blank">2022</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> S</td><td class="p-1"> Seattle Part Time Employees </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Seattle Part Time Employees - Benefits Summary.pdf" target="_blank">2022</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> O</td><td class="p-1"> Seattle Office Salaried   </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Seattle Office Salaried - Benefits Summary (O).pdf" target="_blank">2022</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> Z</td><td class="p-1"> Weekly - Hourly </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Weekly - Hourly - Benefits Summary (Z).pdf" target="_blank">2022</a> <a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Weekly%20-%20Hourly%20-%20Benefits%20Summary%20(Z)%2011.18.22.pdf" target="_blank">2023</a></td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> Z</td><td class="p-1"> Weekly - Salaried PTO NonBen</td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Weekly - Hourly - Benefits Summary (Z).pdf" target="_blank">2022</a> <a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Weekly%20-%20Salaried%20PTO%20NonBen%20-%20Benefits%20Summary%20(Z)%2011.18.22.pdf" target="_blank">2023</a></td>
</tr>

<tr class="p-1">
<td class="text-center p-1"> B</td><td class="p-1"> Google Hourly  </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Google Hourly - Benefits Summary (B) FNL.pdf" target="_blank">2022</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> O</td><td class="p-1"> Office Hourly   </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Office Hourly - Benefits Summary (O).pdf" target="_blank">2022</a> </td>
</tr>

<tr class="p-1">
<td class="text-center p-1"> O</td><td class="p-1"> Seattle Office Salaried   </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Seattle Office Salaried - Benefits Summary (O).pdf" target="_blank">2022</a> </td>
</tr>

</table>
</div>
 </div>`
})
export class ACALT270DaysDialog {
    constructor(public modal: NgbActiveModal) { }
}

@Component({
    selector: 'aca-popup-gt270',
    template: `
  <div class="modal-header">
    <h5 id="modal-title" class="text-primary">Benefit Summaries - Greater than 270 days</h5>
    <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('Cross')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body" style="overflow-y:auto; height: 80vh">
    <div><small class="text-danger">Please note that based on various Collabera policies,
the following are the only medical plan options to be provided to new employees. Employees are locked in for a 12 month period into the plan selected.
For existing employees going on a new project, do not refer to the table below. Depending on what plan they are already in,
they continue in the same plan regardless of W-2 employee type changes until their 12-month period is up.
</small></div>
<div>
<table border="1" align="center">
<tr><th align="center" class="p-2">Group Name</th><th align="center" class="p-2 w-75">Employee Type</th><th align="center" class="p-2">Document</th></tr>

<tr class="p-1">
<td class="text-center p-1"> A</td><td class="p-1"> Hourly + PTO</td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Hourly + PTO - Benefits Summary (A).pdf" target="_blank">2022</a> 
<a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Hourly%20+%20PTO%20-%20Benefits%20Summary%20(A)%2011.18.22.pdf" target="_blank">2023</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> A</td><td class="p-1"> Hourly </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Hourly - Benefits Summary (A).pdf" target="_blank">2022</a> 
<a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Hourly%20-%20Benefits%20Summary%20(A)%2011.18.22.pdf" target="_blank">2023</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> A</td><td class="p-1"> Meta Hourly + Enhanced Benefits </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Meta Hourly - Benefits Summary (A) + Enhanced Benefits Announcement.pdf" target="_blank">2022</a> 
<a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Meta%20Hourly%20-%20Benefits%20Summary%20(A)%20+%20Enhanced%20Benefits%20Announcement%2011.18.22.pdf" target="_blank">2023</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> None</td><td class="p-1"> Meta Part Time </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Meta Part Time - Benefits Summary.pdf" target="_blank">2022</a> 
<a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Meta%20Part%20Time%20-%20Benefits%20Summary%2011.18.22.pdf" target="_blank">2023</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> M</td><td class="p-1"> Microsoft Hourly</td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Microsoft Hourly - Benefits Summary.pdf" target="_blank">2022</a> 
<a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Microsoft%20Hourly%20-%20Benefits%20Summary%2011.18.22.pdf" target="_blank">2023</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> M</td><td class="p-1">  Microsoft Hourly InsVac</td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Microsoft Hourly InsVac - Benefits Summary (M).pdf" target="_blank">2022</a> 
<a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Microsoft%20Hourly%20InsVac%20-%20Benefits%20Summary%20(M)%2011.18.22.pdf" target="_blank">2023</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> M  </td><td class="p-1">  Microsoft Hourly NonBenVac</td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Microsoft Hourly NonBenVac - Benefits Summary.pdf" target="_blank">2022</a> 
<a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Microsoft%20Hourly%20NonBenVac%20-%20Benefits%20Summary%2011.18.22.pdf" target="_blank">2023</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> M </td><td class="p-1">  Microsoft Hourly InsVac Weekly</td>
<td class="p-1 text-center"> <a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Microsoft Hourly InsVac Weekly - Benefits Summary (M).pdf" target="_blank">2022 </a><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Microsoft%20Hourly%20InsVac%20Weekly%20-%20Benefits%20Summary%20(M)%2011.18.22.pdf" target="_blank">2023</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> None </td><td class="p-1">  Part Time Employees </td>
<td class="p-1 text-center"> <a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Part Time Employees - Benefit Summary.pdf" target="_blank">2022</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> S</td><td class="p-1">  Salaried Consultants</td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Salaried Consultants - Benefits Summary (S).pdf" target="_blank">2022</a> 
<a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Salaried%20Consultants%20-%20Benefits%20Summary%20(S)%2011.18.22.pdf" target="_blank">2023</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> A</td><td class="p-1">  Salaried PTO NB</td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Salaried PTO NB - Benefits Summary (A).pdf" target="_blank">2022</a> 
<a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Salaried%20PTO%20NB%20-%20Benefits%20Summary%20(A)%2011.18.22.pdf" target="_blank">2023</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> A</td><td class="p-1">  Seattle Hourly</td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Seattle Hourly - Benefits Summary (A).pdf" target="_blank">2022</a> 
</td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> None </td><td class="p-1">  Salaried Office </td>
<td class="p-1 text-center"> <a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Salaried Office - Benefits Summary.pdf" target="_blank">2022</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> S </td><td class="p-1">  Seattle Salaried Consultants</td>
<td class="p-1 text-center"> <a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Seattle Salaried Consultants - Benefits Summary (S).pdf" target="_blank">2022</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> O </td><td class="p-1">  Seattle Office Salaried</td>
<td class="p-1 text-center"> <a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Seattle Office Salaried - Benefits Summary (O).pdf" target="_blank">2022</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> T</td><td class="p-1">  Weekly - Hourly </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion%202022%20Weekly%20-%20Hourly%20-%20Benefits%20Summary%20(T).pdf" target="_blank">2022</a> 
<a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Weekly%20-%20Hourly%20-%20Benefits%20Summary%20(T)%2011.18.22.pdf" target="_blank">2023</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> W</td><td class="p-1">  Weekly - Salaried  </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Weekly - Salaried - Benefits Summary (W).pdf" target="_blank">2022</a> 
<a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Weekly%20-%20Salaried%20-%20Benefits%20Summary%20(W)%2011.18.22.pdf" target="_blank">2023</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> W</td><td class="p-1">  Weekly - Salaried PTO NonBen  </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Weekly - Salaried PTO NonBen - Benefits Summary (T).pdf" target="_blank">2022</a> 
<a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/2023/Ascendion%202023%20Weekly%20-%20Salaried%20PTO%20NonBen%20-%20Benefits%20Summary%20(T)%2011.18.22.pdf" target="_blank">2023</a> </td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> A</td><td class="p-1">  Google Hourly </td>
<td class="p-1 text-center"><a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Google Hourly - Benefits Summary (A) FNL.pdf" target="_blank">2022</a> 
</td>
</tr>
<tr class="p-1">
<td class="text-center p-1"> O </td><td class="p-1">  Office Hourly</td>
<td class="p-1 text-center"> <a class="btn btn-primary btn-sm p-1" href="https://stmetalprod01.blob.core.windows.net/acadocument/Asc-2022/Ascendion 2022 Office Hourly - Benefits Summary (O).pdf" target="_blank">2022</a> </td>
</tr>
</table>
</div>
</div> `
})
export class ACAGT270DaysDialog {
    constructor(public modal: NgbActiveModal) { }
}


@Component({
    selector: 'gp-gpm-popup',
    template: `
  <div class="modal-header pb-1">
    <h5 id="modal-title" class="text-primary"></h5>
    <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('Cross')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body" style="overflow-y:auto; height: 60vh">
    
<div>
<table  align="center">
<tr class="border-bottom"><th align="center" class="text-center p-2 border-right">H1 Status</th><th align="center" class="p-2">Hourly</th><th align="center" class="p-2">Salaried</th><th align="center" class="p-2">Subtier</th><th align="center" class="p-2">Passthrough</th></tr>
<tr *ngFor="let obj of gpgpmGrid" class="p-1 border-bottom">
  <td class="text-center p-2">{{obj.h1status}}</td>
  <td class="text-center p-2">{{obj.hourly}}</td>
  <td class="text-center p-2">{{obj.salaried}}</td>
  <td class="text-center p-2">{{obj.subtier}}</td>
  <td class="text-center p-2">{{obj.passthrough}}</td>
</tr>
</table>
</div>
 </div>`
})
export class GPGPMGrid {
    constructor(public modal: NgbActiveModal) { }
}

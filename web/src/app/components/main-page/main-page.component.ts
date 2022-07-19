/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit } from '@angular/core';
import { LayerDialogComponent } from '../layer-dialog/layer-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Survey } from '../../shared/models/survey.model';
import { LocationOfInterestService } from '../../services/loi/loi.service';
import { SurveyService } from '../../services/survey/survey.service';
import { ObservationService } from '../../services/observation/observation.service';
import { take } from 'rxjs/operators';
import { NavigationService } from '../../services/navigation/navigation.service';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';
import { TitleDialogComponent } from '../title-dialog/title-dialog.component';

/**
 * Root component for main application page showing map, layers list, and
 * survey header. Responsible for coordinating page-level URL states with
 * various services.
 */
@Component({
  selector: 'ground-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  activeSurvey$: Observable<Survey>;
  subscription: Subscription = new Subscription();
  sideNavOpened: boolean;
  constructor(
    private navigationService: NavigationService,
    private surveyService: SurveyService,
    private loiService: LocationOfInterestService,
    private observationService: ObservationService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    // TODO: Make dynamic to support i18n.
    this.sideNavOpened = true;
    this.activeSurvey$ = this.surveyService.getActiveSurvey$();
  }

  ngOnInit() {
    // Show title dialog to assign title on a new survey.
    this.subscription.add(
      this.navigationService
        .getSurveyId$()
        .subscribe(
          id => id === NavigationService.LAYER_ID_NEW && this.showTitleDialog()
        )
    );
    // Show layer dialog when non-null layer id set in URL.
    this.subscription.add(
      this.navigationService
        .getLayerId$()
        .subscribe(id => id && this.showEditLayerDialog(id))
    );
    // Show loi details when non-null LOI id set in URL.
    this.subscription.add(
      this.navigationService
        .getLocationOfInterestId$()
        .subscribe(id => id && this.loadLocationOfInterestDetails(id))
    );
    // Show/hide observation when observation id set in URL.
    this.subscription.add(
      this.navigationService
        .getObservationId$()
        .subscribe(id => this.editObservation(id))
    );
    // Redirect to sign in page if user is not authenticated.
    this.subscription.add(
      this.authService.isAuthenticated$().subscribe(isAuthenticated => {
        if (!isAuthenticated && !environment.useEmulators) {
          this.navigationService.signIn();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private showTitleDialog() {
    this.dialog.open(TitleDialogComponent, {
      width: '500px',
      disableClose: true,
    });
  }

  private showEditLayerDialog(layerId: string) {
    this.activeSurvey$.pipe(take(1)).subscribe(survey =>
      this.dialog.open(LayerDialogComponent, {
        autoFocus: layerId === NavigationService.LAYER_ID_NEW,
        data: {
          surveyId: survey.isUnsavedNew()
            ? NavigationService.SURVEY_ID_NEW
            : survey.id,
          createLayer: layerId === NavigationService.SURVEY_ID_NEW,
          layer: survey.layers?.get(layerId),
        },
        panelClass: 'layer-dialog-container',
      })
    );
  }

  private loadLocationOfInterestDetails(loiId: string) {
    this.loiService.selectLocationOfInterest(loiId);
  }

  private editObservation(observationId: string | null) {
    if (observationId) {
      this.observationService.selectObservation(observationId);
    } else {
      this.observationService.deselectObservation();
    }
  }
}

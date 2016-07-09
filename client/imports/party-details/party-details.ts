import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { Tracker } from 'meteor/tracker';
import {Parties} from '../../../collections/parties.ts';

@Component({
  selector: 'party-details',
  templateUrl: '/client/imports/party-details/party-details.html',
  directives: [ROUTER_DIRECTIVES]
})
export class PartyDetails {
  partyId: string;
  party: Party;

  constructor(private route: ActivatedRoute, private ngZone: NgZone) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.partyId = params['partyId'];

      Tracker.autorun(() => {
        this.ngZone.run(() => {
          this.party = Parties.findOne(this.partyId);
        });
      });
    });
  }

  saveParty(party) {
    Parties.update(party._id, {
      $set: {
        name: party.name,
        description: party.description,
        location: party.location
      }
    });
  }
}

/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
//  * Sample transaction
//  * @param {org.example.biznet.SampleTransaction} sampleTransaction
//  * @transaction
//  */
// async function sampleTransaction(tx) {
//     // Save the old value of the asset.
//     const oldValue = tx.asset.value;

//     // Update the asset with the new value.
//     tx.asset.value = tx.newValue;

//     // Get the asset registry for the asset.
//     const assetRegistry = await getAssetRegistry('org.example.biznet.SampleAsset');
//     // Update the asset in the asset registry.
//     await assetRegistry.update(tx.asset);

//     // Emit an event for the modified asset.
//     let event = getFactory().newEvent('org.example.biznet', 'SampleEvent');
//     event.asset = tx.asset;
//     event.oldValue = oldValue;
//     event.newValue = tx.newValue;
//     emit(event);
// }

/**
 * Create the AdContract asset
 * @param {org.example.biznet.InitialApplication} initalAppliation - the InitialApplication transaction
 * @transaction
 */
async function initialApplication(application) { // eslint-disable-line no-unused-vars
    const factory = getFactory();
    const namespace = 'org.example.biznet';

    const letter = factory.newResource(namespace, 'AdContract', application.contractId);
    letter.owner = factory.newRelationship(namespace, 'Advertiser', application.owner); // owner
    letter.adagency = factory.newRelationship(namespace, 'AdAgency', application.adagency); // adagency
    // letter.mediarep = factory.newRelationship(namespace, 'MediaRep', application.mediarep);
    // letter.mediaagent = factory.newRelationship(namespace, 'MediaAgent', application.mediaagent);
    letter.adDetails = application.adDetails;
    
    letter.approval = [
        factory.newRelationship(namespace, 'Advertiser', application.owner)
        ,factory.newRelationship(namespace, 'AdAgency', application.adagency)];
        // 광고주, 광고대행사 두 개체는 실행 시점에서 이미 허락한 것으로 간주하기에 relation을 두 개 걸어둔다.

    letter.days = application.days;
    letter.times = application.times;
    letter.programTitle = application.programTitle;
    letter.status = 'AWAITING_APPROVAL';

    //save the application
    const assetRegistry = await getAssetRegistry(letter.getFullyQualifiedType());
    await assetRegistry.add(letter);

    // emit event
    // const applicationEvent = factory.newEvent(namespace, 'InitialApplicationEvent');
    // applicationEvent.loc = letter;
    // emit(applicationEvent);
}

/**
 * Update the LOC to show that it has been approved by a given person
 * @param {org.example.biznet.Approve} approve - the Approve transaction
 * @transaction
 */
async function approve(approveRequest) { // eslint-disable-line no-unused-vars
    const factory = getFactory();
    const namespace = 'org.example.biznet';

    let letter = approveRequest.loc;

    if (letter.status === 'CLOSED' || letter.status === 'REJECTED') {
        throw new Error ('This Contract is either CLOSED or REJECTED.');
    } else if (letter.approval.length === 4) {
        throw new Error ('All four parties have already approved this Contract.');
    } else if (letter.approval.includes(approveRequest.approvingParty)) {
        throw new Error ('This person has already approved this letter of credit');
    } else if (approveRequest.approvingParty.getType() === 'BankEmployee') {
        letter.approval.forEach((approvingParty) => {
            let bankApproved = false;
            try {
                bankApproved = approvingParty.getType() === 'BankEmployee' && approvingParty.bank.getIdentifier() === approveRequest.approvingParty.bank.getIdentifier();
            } catch (err) {
                // ignore error as they don't have rights to access that participant
            }
            if (bankApproved) {
                throw new Error('Your bank has already approved of this request');
            }
        });
    }

    letter.approval.push(factory.newRelationship(namespace, approveRequest.approvingParty.getType(), approveRequest.approvingParty.getIdentifier()));
    // update the status of the letter if everyone has approved
    if (letter.approval.length === 4) {
        letter.status = 'APPROVED';
    }

    // update approval[]
    const assetRegistry = await getAssetRegistry(approveRequest.loc.getFullyQualifiedType());
    await assetRegistry.update(letter);

    // // emit event
    // const approveEvent = factory.newEvent(namespace, 'ApproveEvent');
    // approveEvent.loc = approveRequest.loc;
    // approveEvent.approvingParty = approveRequest.approvingParty;
    // emit(approveEvent);
}



/**
 * Create the participants needed for the demo
 * @param {org.example.biznet.CreateDemoParticipants} createDemoParticipants - the CreateDemoParticipants transaction
 * @transaction
 */
async function createDemoParticipants() { // eslint-disable-line no-unused-vars
    const factory = getFactory();
    const namespace = 'org.example.biznet';

    // create the Advertiser
    const AdvertiserRegistry = await getParticipantRegistry(namespace + '.Advertiser');
    const Samsung = factory.newResource(namespace, 'Advertiser', 'Samsung');
    Samsung.name = 'Samsung Person';
    await AdvertiserRegistry.add(Samsung);

    const AdAgencyRegistry = await getParticipantRegistry(namespace + '.AdAgency');
    const Jaeil = factory.newResource(namespace, 'AdAgency', 'Jaeil');
    Jaeil.name = 'Jaeil Person';
    await AdAgencyRegistry.add(Jaeil);

    const MediaRepRegistry = await getParticipantRegistry(namespace + '.MediaRep');
    const JTBC = factory.newResource(namespace, 'MediaRep', 'JTBC');
    JTBC.name = 'JTBC';
    await MediaRepRegistry.add(JTBC);

    const MediaAgentRegistry = await getParticipantRegistry(namespace + '.MediaAgent');
    const TV = factory.newResource(namespace, 'MediaAgent', 'TV');
    TV.name = 'TV광고';
    await MediaAgentRegistry.add(TV);
    // const bank2 = factory.newResource(namespace, 'Bank', 'EB');
    // bank2.name = 'Eastwood Banking';
    // await bankRegistry.add(bank2);

    // create Samsung employees
    // var employeeRegistry = await getParticipantRegistry(namespace + '.BankEmployee');
    // const employee1 = factory.newResource(namespace, 'BankEmployee', 'matias');
    // employee1.name = 'Matías';
    // employee1.bank = factory.newRelationship(namespace, 'Bank', 'BoD');
    // await employeeRegistry.add(employee1);
    // const employee2 = factory.newResource(namespace, 'BankEmployee', 'ella');
    // employee2.name = 'Ella';
    // employee2.bank = factory.newRelationship(namespace, 'Bank', 'EB');
    // await employeeRegistry.add(employee2);

    // // create customers
    // const customerRegistry = await getParticipantRegistry(namespace + '.Customer');
    // const customer1 = factory.newResource(namespace, 'Customer', 'alice');
    // customer1.name = 'Alice';
    // customer1.lastName= 'Hamilton';
    // customer1.bank = factory.newRelationship(namespace, 'Bank', 'BoD');
    // customer1.companyName = 'QuickFix IT';
    // await customerRegistry.add(customer1);
    // const customer2 = factory.newResource(namespace, 'Customer', 'bob');
    // customer2.name = 'Bob';
    // customer2.lastName= 'Appleton';
    // customer2.bank = factory.newRelationship(namespace, 'Bank', 'EB');
    // customer2.companyName = 'Conga Computers';
    // await customerRegistry.add(customer2);
}
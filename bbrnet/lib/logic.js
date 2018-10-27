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
    letter.mediarep = factory.newRelationship(namespace, 'MediaRep', application.mediarep);
    letter.mediaagent = factory.newRelationship(namespace, 'MediaAgent', application.mediaagent);
    letter.adDetails = application.adDetails;
    letter.approval = [
        factory.newRelationship(namespace, 'Advertiser', application.owner)
        ,factory.newRelationship(namespace, 'AdAgency', application.adagency)];
        // 광고주, 광고대행사 두 개체는 실행 시점에서 이미 허락한 것으로 간주하기에 
        // relation을 두 개 걸어둔다.


    letter.days = application.days;
    letter.times = application.times;
    letter.programTitle = application.programTitle;
    letter.status = 'AWAITING_APPROVAL';

    //save the application
    const assetRegistry = await getAssetRegistry(letter.getFullyQualifiedType());
    await assetRegistry.add(letter);

}

/**
 * Update the LOC to show that it has been approved by a given person
 * @param {org.example.biznet.Approve} approve - the Approve transaction
 * @transaction
 */
async function approve(approveRequest) { // eslint-disable-line no-unused-vars
    const factory = getFactory();
    const namespace = 'org.example.biznet';

    let letter = approveRequest.adc;
    
    if (letter.status === 'CLOSED' || letter.status === 'REJECTED') {
        throw new Error ('This Contract is either CLOSED or REJECTED.');
    } else if (letter.approval.length > 4) {
        throw new Error ('All four parties have already approved this Contract.');
    } else if (letter.approval.includes(approveRequest.approvingParty)) {
        // 같은 Participant가 중복 실행할 경우 오류 반환
        throw new Error ('This person has already signed this Contract.');
    } else if (approveRequest.approvingParty.getType() === 'MediaRep') {
        letter.approval.push(factory.newRelationship(namespace, approveRequest.approvingParty.getType(), approveRequest.approvingParty.getIdentifier()));
        letter.status = "APPROVED"
    }
    else if (approveRequest.approvingParty.getType() === 'MediaAgent'){
        letter.approval.push(factory.newRelationship(namespace, approveRequest.approvingParty.getType(), approveRequest.approvingParty.getIdentifier()));
    }    
    if (letter.approval.length === 4) {
        letter.status = 'COMMITTED';
    }
    
    const assetRegistry = await getAssetRegistry(approveRequest.adc.getFullyQualifiedType());
    await assetRegistry.update(letter);

}

/**
 * Update the LOC to show that it has been approved by a given person
 * @param {org.example.biznet.Reject} Reject - the Approve transaction
 * @transaction
 */
async function Reject(RejectRequest){
    // const factory = getFactory();
    // const namespace = 'org.example.biznet';

    let letter = RejectRequest.adc;
    if (letter.status === 'REJECTED'){
        throw new Error("This Contract is already rejected.");
    }

    letter.closePerson = RejectRequest.rejectingParty.getIdentifier();
    letter.closeReasson = RejectRequest.closeReason;
    letter.status = "REJECTED";

    const assetRegistry = await getAssetRegistry(RejectRequest.adc.getFullyQualifiedType());
    await assetRegistry.update(letter);
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
    let JTBC = factory.newResource(namespace, 'MediaRep', 'JTBC미디어컴');
    let MBC = factory.newResource(namespace, 'MediaRep', 'MBC코바코');
    let KBS = factory.newResource(namespace, 'MediaRep', 'KBS코바코');
    let TVJ = factory.newResource(namespace, 'MediaRep', 'TV조선미디어렙');
    let SBS = factory.newResource(namespace, 'MediaRep', 'SBS미디어크리에이트');
    let TVN = factory.newResource(namespace, 'MediaRep', '메조미디어');
    JTBC.name ='JTBC';
    MBC.name = 'MBC';
    KBS.name = 'KBS';
    TVJ.name = "TV조선";
    SBS.name = 'SBS';
    TVN.name = 'TVN';
    await MediaRepRegistry.add(JTBC);
    await MediaRepRegistry.add(MBC);
    await MediaRepRegistry.add(KBS);
    await MediaRepRegistry.add(TVJ);
    await MediaRepRegistry.add(SBS);
    await MediaRepRegistry.add(TVN);

    const MediaAgentRegistry = await getParticipantRegistry(namespace + '.MediaAgent');
    JTBC = factory.newResource(namespace, 'MediaAgent', 'JTBC');
    MBC  = factory.newResource(namespace, 'MediaAgent',  'MBC');
    KBS  = factory.newResource(namespace, 'MediaAgent',  'KBS');
    TVJ  = factory.newResource(namespace, 'MediaAgent', "TV조선");
    SBS  = factory.newResource(namespace, 'MediaAgent',  'SBS');
    TVN  = factory.newResource(namespace, 'MediaAgent',  'TVN');
    JTBC.name ='JTBC';
    MBC.name = 'MBC';
    KBS.name = 'KBS';
    TVJ.name = "TV조선";
    SBS.name = 'SBS';
    TVN.name = 'TVN';
    await MediaAgentRegistry.add(JTBC);
    await MediaAgentRegistry.add(MBC);
    await MediaAgentRegistry.add(KBS);
    await MediaAgentRegistry.add(TVJ);
    await MediaAgentRegistry.add(SBS);
    await MediaAgentRegistry.add(TVN);
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
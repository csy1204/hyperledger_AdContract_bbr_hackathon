# BBR Hackathon Adition

## Participant

1. Advertiser
2. AdAgency
3. MediaRep
4. MediaAgent

### Advertiser (광고주)
- String advertiserId
- String name

### AdAgency (광고대행)
- String adAgnecyId
- String name

### MediaRep (미디어렙, 매체대행)
- String mediaRepId
- String name
- --> MediaAgent agent

### MediaAgent (매체사)
- String mediaAgentId
- String name


axios.post(this.config.restServer.httpURL+'/InitialApplication', {
    "$class": "org.example.loc.InitialApplication",
    "letterId": ("L" + currentTime),
    "applicant": "resource:org.example.loc.Customer#alice",
    "beneficiary": "resource:org.example.loc.Customer#bob",
    "rules": this.createRules(),
    "productDetails": {
    "$class": "org.example.loc.ProductDetails",
    "productType": type,
    "quantity": quantity,
    "pricePerUnit": price.toFixed(2)
    }

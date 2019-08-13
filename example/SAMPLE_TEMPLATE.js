/* eslint-disable no-useless-escape */

/**
* SAMPLE TEMPLATE
* - for example app
* - for __tests__
*/

export default `<%
==Personal Info==
[[Contestant Name]]
[[Contestant Address]]
[[Contestant DOB]]
[[Contestant Picture]]
[[Contestant ETH Address]]

==Experience==
[[Contestant BBQ Experience Years]]
[[Contestant Longest BBQ]]
[[BBQ Contestant Status]]
[[Certification List: Collection<BBQ Certifications>]]

==Preferences==
[[Contestant BBQ Region]]
[[BBQ Love Limit]]
[[Contestant Personal Statement]]
[[Favorite Meats: Collection<Text>]]

==Medical Info==
[[Contestant BBQ Medical]]
[[Please explain your BBQ sauce medical history]]
[[MedicalContact: Contestant Emergency Contact]]
%>

\\centered **International BBQ Cookoff Registration**

[[Contestant Name "Your Name"]]
[[Contestant Address: Address "Mailing Address"]]
[[Contestant DOB: Date "Date of Birth"]]
[[Contestant Picture: Image]]

**Basic YesNo**
Returning Contestant: [[BBQ Contestant Status: YesNo "Are you a returning U.S. BBQ Championships contestant?"]]

**Number**
[[Contestant BBQ Experience Years: Number "How many years of BBQ experience do you have?"]]

**Period**
[[Contestant Longest BBQ: Period "What is the longest BBQ you ever conducted? (e.g. 1 week, 1 day 2 hours)"]]

[[Contestant Regional Style: Choice("Carolinas", "Hawaii", "Kansas City", "Memphis", "Texas")]]

**Choice type**
[[Contestant BBQ Region: Contestant Regional Style "Your Regional Style"]]

**Basic YesNo Conditional**
{{BBQ Love Limit "Do you love BBQ?" =>
  I, [[Contestant Name]], declare I love BBQ.
}}

**Nested conditional**
{{Contestant BBQ Medical "Do you have any medical complications related to BBQ sauces?" =>
  [[Please explain your BBQ sauce medical history: LargeText]]
}}

**LargeText**
[[Contestant Personal Statement: LargeText "Please write a brief personal statement"]]

**Ethereum Address**
[[Contestant ETH Address: EthAddress "Your ETH address for the registration fee ($200)"]]

**DateTime**
[[Contestant Signature Date Time: DateTime "Date & Time of Signature"]]

[[Contestant Email: Identity | Signature]]

[[Contestant Emergency Contact: Structure(
  Emergency Contact Name: Text;
  Emergency Contact Phone: Text
)]]

[[#MedicalContact: Contestant Emergency Contact]]

**Structure**
Name: [[MedicalContact.Emergency Contact Name]]
Phone: [[MedicalContact.Emergency Contact Phone]]

[[#Favorite Meats: Collection<Text>]]

**Collection**
{{#for each Meat: Favorite Meats =>
  - Meat Type: [[Meat]]
}}

[[BBQ Certifications: Structure(
  Certification Title: Text;
  Certification Date: Date;
  Certifier Eth Address: EthAddress
)]]

[[#Certification List: Collection<BBQ Certifications>]]

**Collection: Structure**
{{#for each Cert: Certification List =>
  **Certifcation:**
  - Title: [[Cert.Certification Title]]
  - Date: [[Cert.Certification Date]]
  - Certifier Eth Address: [[Certifier Eth Address]]
}}

[[DocuSign Signatory: ExternalSignature(serviceName: "DocuSign")]]
`;

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
[[CertList: Collection<BBQ Certifications>]]

==Preferences==
[[Contestant BBQ Region]]
[[BBQ Love Limit]]
[[Contestant Personal Statement]]
[[Favorite Meats: Collection<EthAddress>]]

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

# Basic YesNo
[[BBQ Contestant Status: YesNo "Are you a returning U.S. BBQ Championships contestant?"]]

# Number
[[Contestant BBQ Experience Years: Number "How many years of BBQ experience do you have?"]]

# Period
[[Contestant Longest BBQ: Period "What is the longest BBQ you ever conducted? (e.g. 1 week, 1 day 2 hours)"]]

# Choice type
[[Contestant Regional Style: Choice("Carolinas", "Hawaii", "Kansas City", "Memphis", "Texas")]]

# Choice type usage
[[Contestant BBQ Region: Contestant Regional Style "Your Regional Style"]]

# Basic YesNo Conditional
{{BBQ Love Limit "Do you love BBQ?" =>
  I, [[Contestant Name]], declare I love BBQ.
}}

# Nested conditional
{{Contestant BBQ Medical "Do you have any medical complications related to BBQ sauces?" =>
  [[Please explain your BBQ sauce medical history: LargeText]]
}}

# LargeText
[[Contestant Personal Statement: LargeText "Please write a brief personal statement"]]

# Ethereum Address
[[Contestant ETH Address: EthAddress "Your ETH address for the registration fee ($200)"]]

# DateTime
[[Contestant Signature Date Time: DateTime "Date & Time of Signature"]]

# Identity
[[Contestant Email: Identity | Signature]]

# Structure definition
[[Contestant Emergency Contact: Structure(
  Emergency Contact Name: Text;
  Emergency Contact Phone: Text
)]]

# Structure type var
[[#MedicalContact: Contestant Emergency Contact]]

**Emergency Contact**
Name: [[MedicalContact.Emergency Contact Name]]
Phone: [[MedicalContact.Emergency Contact Phone]]

# Collection definition
[[#Favorite Meats: Collection<EthAddress>]]

**Contestant's Favorite Meats**
{{#for each Meat: Favorite Meats =>
  - Meat Type: [[Meat]]
}}

# Structure for Collection definition
[[BBQ Certifications: Structure(
  Title: Text;
  Date: Date
)]]

# Collection of Structure definition
[[#CertList: Collection<BBQ Certifications>]]

**Contestant BBQ Certifications**
{{#for each Cert: CertList =>
  **Certifcation:**
  - Certification Title: [[Cert.Title]]
  - Certification Date: [[Cert.Date]]
}}

# External Signature: "DocuSign"
[[DocuSign Signatory: ExternalSignature(serviceName: "DocuSign")]]
`;

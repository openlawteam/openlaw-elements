// @flow

/**
* External Call Structure Helper
*
* Because we are using the variable type `ExternalSignature`
* in our SAMPLE_TEMPLATE, any example app, or test we write
* which uses the template needs data for an external call structure argument
* to `Openlaw.execute()`
*/

const ABIString =
  '{"input":{"typeDefinition":{"signerEmail":{"name":"signerEmail","variableTypeDe'
  + 'finition":{"name":"Text","typeParameter":null},"description":null,"formatter":nu'
  + 'll,"isHidden":false,"defaultValue":null},"contractContentBase64":{"name":"contra'
  + 'ctContentBase64","variableTypeDefinition":{"name":"Text","typeParameter":null},"'
  + 'description":null,"formatter":null,"isHidden":false,"defaultValue":null},"contra'
  + 'ctTitle":{"name":"contractTitle","variableTypeDefinition":{"name":"Text","typePa'
  + 'rameter":null},"description":null,"formatter":null,"isHidden":false,"defaultValu'
  + 'e":null}},"names":["signerEmail","contractContentBase64","contractTitle"],"types'
  + '":{"signerEmail":{"name":"Text"},"contractContentBase64":{"name":"Text"},"contra'
  + 'ctTitle":{"name":"Text"}}},"output":{"typeDefinition":{"signerEmail":{"name":"si'
  + 'gnerEmail","variableTypeDefinition":{"name":"Text","typeParameter":null},"descri'
  + 'ption":null,"formatter":null,"isHidden":false,"defaultValue":null},"signature":{'
  + '"name":"signature","variableTypeDefinition":{"name":"Text","typeParameter":null}'
  + ',"description":null,"formatter":null,"isHidden":false,"defaultValue":null},"reco'
  + 'rdLink":{"name":"recordLink","variableTypeDefinition":{"name":"Text","typeParame'
  + 'ter":null},"description":null,"formatter":null,"isHidden":false,"defaultValue":n'
  + 'ull}},"names":["signerEmail","signature","recordLink"],"types":{"signerEmail":{"'
  + 'name":"Text"},"signature":{"name":"Text"},"recordLink":{"name":"Text"}}}}';

export default (serviceName: string = 'DocuSign') => ({ [serviceName]: ABIString });

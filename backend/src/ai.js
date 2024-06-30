const {
  FunctionDeclarationSchemaType,
  HarmBlockThreshold,
  HarmCategory,
  VertexAI
} = require('@google-cloud/vertexai');

const project = 'szr-hackathon-sbx-5242';
const location = 'europe-west4';
const textModel =  'gemini-1.5-flash-001';

const vertexAI = new VertexAI({project: project, location: location});

const generativeModel = vertexAI.getGenerativeModel({
  model: textModel,
  // The following parameters are optional
  // They can also be passed to individual content generation requests
  safetySettings: [{category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE}],
  generationConfig: {maxOutputTokens: 256, temperature: 0.2, topP: 0.8},
});

const generateContent = async (inputData) => {
  const inputText = generateInput(inputData)
  const request = {
    contents: [{role: 'user', parts: [{text: inputText}]}],
  };
  const result = await generativeModel.generateContent(request);
  const response = result.response;
  const resJson = response.candidates[0].content.parts[0].text
  const resObject = JSON.parse(resJson.replace('```json', '').replace('```', ''))
  return resObject
};

const generateInput = (input) => { return `
        Please try to deliver valid json.

        Update the tags values:
        -plant
        -reason
        -period
        -remark
        -Restriction

        tags: 
        vehicle
        cancel
        damage
        defect
        delay
        delivery
        failure
        limited
        loose_crystalline
        Ochsenfurt
        outage
        plant
        platting
        resumption
        schedule
        shipment
        silo
        sugar

        input: Update: Water Ingress Screening and Shipping Loose Crystalline - from now on - Ochsenfurt Plant

        Hello everyone

        we can give you the following update:
        The inspection and assessment of the damage has been completed and we can give the all-clear.
        The cleaning work will continue for some time and operations will be resumed.

        We expect that sugar will be available again in about 2 hours and that loading can be resumed in the loose crystalline area.
        The customer deliveries scheduled for tomorrow can thus be loaded.

        We would set the resumption of the WZ2 transfers for about 5 p.m. (so that sufficient sugar is available again).

        output: plant: Ochsenfurt,
        update: resume Shipping Loose Crystalline,
        reason: inspection of the damage complete,
        period: tomorrow,
        remark:customer deliveries scheduled for tomorrow can be loaded
        Restriction:  sugar will be available again in about 2 hours for loading.
        resumption of the WZ2 transfers for about 5 p.m.

        input: Unsere Mitarbeiter arbeiten mit Hochdruck an der Behebung des Schadens (Schweißen des Kessels) und der schnellen Wiederinbetriebnahme.
        Wir halten Sie informiert!
        ?Boiler damage - now on - Ochsenfurt plant

        Dear colleagues,

        due to a boiler damage at the weekend, only limited sugar production is possible in the OC plant!

        Reason:                              Crack in the coal-fired boiler

        Period:                         from now until probably 15.11.2023 (Elimination of causes and commissioning 13.11.+14.11.23)

        Restriction:                  - Max. 1 charge/hour WZ2 possible to customers     
        -    No relocation WZ2 to Zeil! (so that customers can be served)
        -    Relocation WZ1 max. 175 to = 6 loads/24 h!


        Please urgently change the scheduled deliveries and give up prioritization:

        Our employees are working flat out to repair the damage (welding the boiler) and to quickly recommission.
        We will keep you informed!



        output: plant: Ochsenfurt,
        update: limited sugar production,
        reason: Crack in the coal-fired boiler,
        period: until 15.11.2023,
        remark:urgently change the scheduled deliveries and give up prioritization.
        Restriction:                  - Max. 1 charge/hour WZ2 possible to customers     
        -    No relocation WZ2 to Zeil! (so that customers can be served)
        -    Relocation WZ1 max. 175 to = 6 loads/24 h!

        input: UPDATE: still limited capacity after robot conversion

        Hello everyone

        unfortunately, the robot still does not run stably.
        The production lines in the fondant area are therefore running with a limited production capacity of up to approx. 75%.
        These restrictions will remain in place until the optimisation measures take effect.

        Longer lead times for fondant products are still to be expected. 
        Please continue to contact the ZWV masters directly for product inquiries.
        97199 Ochsenfurt
        output: plant: Ochsenfurt,
        update: limited capacity 
        reason: robot conversion,
        period: until optimization,
        remark:fondant products are still to be expected. contact the ZWV masters 
        Restriction: The production lines in the fondant area are therefore running with a limited production capacity of up to approx. 75%.

        input: ${input}


        output:` }

module.exports = {
  generateContent
}
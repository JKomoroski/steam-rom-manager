import { ValidatorModifier, UserConfiguration } from '../../models';
import * as _ from "lodash";

let replaceVariables_undefined = (oldValue: any) => typeof oldValue === 'string' ? oldValue.replace(/\${dir}/gi, '${romDir}').replace(/\${file}/gi, '${fileName}').replace(/\${sep}/gi, '${/}') : '';
let versionUp = (version: number) => { return version + 1 };

export const configPreset: ValidatorModifier<UserConfiguration> = {
  controlProperty: 'presetVersion',
  latestVersion: 3,
  fields: {
    undefined: {
      'presetVersion': { method: ()=>0 },
        'parserInputs': {
        method: (oldValue, oldConfiguration: any) => {
          let result: any = {};
          if(oldConfiguration.parserType=='Glob'){
            result['glob'] = oldConfiguration.parserInputs['glob']
          } else if(oldConfiguration.parserType=='Glob-regex') {
            result['glob-regex'] = oldConfiguration.parserInputs['glob-regex']
          } else if(oldConfiguration.parserType=='Epic') {
            result['manifests'] = null;
          }
          return result;
        }
      }
    },
    0: {
      'presetVersion': { method: versionUp },
      'parserInputs': {
        method: (oldValue, oldConfiguration: any)=>{
          let newValue = _.cloneDeep(oldValue);
          if(['Manual','Epic'].includes(oldConfiguration.parserType)) {
            if(oldConfiguration.parserType=='Epic') {
              newValue.epicManifests = oldValue.manifests || "";
            } else {
              newValue.manualManifests = oldValue.manifests || "";
            }
            delete newValue.manifests;
          }
          return newValue;
        }
      },
      'imageProviderAPIs': {
        method: (oldValue, oldConfiguration: any) => {
          return {
            SteamGridDB: {
              nsfw: false,
              humor: false,
              imageMotionTypes: ['static']
            }
          };
        }
      }
    },
    1: {
      'presetVersion': { method: versionUp },
      'imageProviderAPIs': {
        method: (oldValue, oldConfiguration: any) => {
          let newValue = _.cloneDeep(oldValue);
          newValue["SteamGridDB"]["styles"] = [];
          return newValue;
        }
      }
    },
    2: {
      'presetVersion': { method: versionUp },
      'imageProviderAPIs': {
        method: (oldValue, oldConfiguration: any) => {
          let newValue = _.cloneDeep(oldValue);
          newValue["SteamGridDB"]["stylesHero"] = [];
          newValue["SteamGridDB"]["stylesLogo"] = [];
          newValue["SteamGridDB"]["stylesIcon"] = [];
          return newValue;
        }
      }
    }
  }
};

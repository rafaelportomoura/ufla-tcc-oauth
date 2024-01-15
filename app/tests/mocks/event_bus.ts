import { CONFIGURATION } from '../../src/constants/configuration';
import { EventBusMessageAttributes } from '../../src/types/EventBus';

export class MockEventBus {
  static success(): EventBusMessageAttributes {
    return {
      event: {
        DataType: 'String',
        StringValue: CONFIGURATION.MICROSERVICE
      },
      type: {
        DataType: 'String',
        StringValue: 'create'
      },
      status: {
        DataType: 'String',
        StringValue: 'success'
      }
    };
  }
}

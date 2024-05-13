import axios, { AxiosInstance } from 'axios';
import { expect } from 'chai';
import Sinon from 'sinon';
import { Api } from '../../../src/adapters/api';

describe('Adapters -> API', async () => {
  beforeEach(Sinon.restore);
  it('Should call get api with query parameters', async () => {
    Sinon.stub(axios, 'create').returns({
      get: async (path: string) => ({ data: { path } })
    } as unknown as AxiosInstance);
    const api = new Api({});
    const { path } = await api.get<{ path: string }>('test', { test: 'test' });
    expect(path).eq('test?test=test');
  });
  it('Should call get api without query parameters', async () => {
    const api = new Api({});
    const { path } = await api.get<{ path: string }>('test');
    expect(path).eq('test');
  });
});

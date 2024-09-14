import { Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { JwtServiceInterface } from '../interfaces/jwt-service-interface';
import { JwtService } from './jwt-service';

vi.mock('jose', () => ({
  jwtVerify: vi.fn(),
}));

describe('jwtService', () => {
  let jwtService: JwtServiceInterface;

  beforeEach(() => {
    jwtService = new JwtService();

    vi.spyOn(jwtService, 'signJWT').mockRejectedValue(new Error('generic error'));
    vi.spyOn(jwtService, 'renewTokenWithPassportOrThrowError');
  });

  it('should throw error trying auth', async () => {
    const RequestMock = {
      cookies: {},
    } as unknown as Request;

    const ResposeMock = {
      cookie: () => null,
    } as any as Response;

    vi.spyOn(jwtService, 'signJWT');

    await expect(jwtService.getSession(RequestMock, ResposeMock)).rejects.toThrow(
      'unauthorized session!'
    );
    expect(jwtService.signJWT).toBeCalledTimes(0);
  });

  it('should thorow error bacause refreshToken is invalid', async () => {
    const requestMock = {
      cookies: {
        __access_token: 'accessTokenInvalid',
        __refresh_token: 'refreshTokenInvalid',
      },
    } as unknown as Request;

    const responseMock = {
      cookie: () => null,
    } as any as Response;

    (jwtVerify as Mock).mockRejectedValue(new Error('generic error'));

    await expect(jwtService.getSession(requestMock, responseMock)).rejects.toThrow(
      'session expired!'
    );
    expect(jwtService.renewTokenWithPassportOrThrowError).toBeCalledTimes(1);
    expect(jwtService.signJWT).toBeCalledTimes(0);
    expect(jwtVerify).toBeCalledTimes(2);
  });
});

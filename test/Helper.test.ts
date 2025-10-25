import { describe, expect, test } from '@jest/globals';
import { validatePaginationByReqQuery } from '../src/helpers/Helper';
import { PaginationRequestDTO } from '../src/dtos/PaginationRequestDTO';

describe('Helper.ts', () => {
    const defaultPaginationRequestDto: PaginationRequestDTO = { page: 1, limit: 5 };

    describe('Expected scenarios', () => {
        describe('Given a valid pagination object', () => {
            test('Should return a instance of PaginationRequestDTO with valid properties', () => {
                expect(validatePaginationByReqQuery({ page: 2, limit: 4 })).toEqual({ page: 2, limit: 4 } as PaginationRequestDTO);
            });
        })
    })

    describe('Unexpected scenarios', () => {
        describe("Given a null pagination object", () => {
            test('Should return an instance of PaginationRequestDTO with default values ', () => {
                expect(validatePaginationByReqQuery(null as unknown as object)).toEqual(defaultPaginationRequestDto);
            });
        })

        describe("Given a undefined pagination object", () => {
            test('Should return an instance of PaginationRequestDTO with default values ', () => {
                expect(validatePaginationByReqQuery(undefined as unknown as object)).toEqual(defaultPaginationRequestDto);
            });
        })

        describe("Given a empty pagination object", () => {
            test('Should return an instance of PaginationRequestDTO with default values ', () => {
                expect(validatePaginationByReqQuery({})).toEqual(defaultPaginationRequestDto);
            });
        })
    })

    describe('Alternavite scenarios', () => {
        describe("Given a pagination object only with limit property", () => {
            test('Should return an instance of PaginationRequestDTO with limit and default page value', () => {
                expect(validatePaginationByReqQuery({ limit: 10 })).toMatchObject({
                    page: expect.any(Number),
                    limit: expect.any(Number),
                })
            });
        })
        
        describe("Given a pagination object only with page property", () => {
            test('Should return an instance of PaginationRequestDTO with page and default limit value', () => {
                expect(validatePaginationByReqQuery({ page: 3 })).toMatchObject({
                    page: expect.any(Number),
                    limit: expect.any(Number),
                });
            });
        })
    })

})
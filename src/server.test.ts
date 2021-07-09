/*
 *    Copyright 2021 Paul Hagedorn (Panzer1119)
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 */


const express = require("express");
const supertest = require("supertest");
const request = supertest("http://localhost:3003");

// jest.mock("./users.json", () => [
//     {
//         "token": "test",
//         "user": "test",
//         "role": "test",
//         "id": 0
//     }
// ])

describe("testing-server-routes", () => {
    it("GET /webhook - failure", async () => {
        const { body } = await request.get("/webhook", (err: any, res: any) => {
            console.error(err);
            console.debug(res);
        });
        // expect(body).toEqual([
        //     {
        //         state: "NJ",
        //         capital: "Trenton",
        //         governor: "Phil Murphy",
        //     },
        //     {
        //         state: "CT",
        //         capital: "Hartford",
        //         governor: "Ned Lamont",
        //     },
        //     {
        //         state: "NY",
        //         capital: "Albany",
        //         governor: "Andrew Cuomo",
        //     },
        // ]);
    });
});

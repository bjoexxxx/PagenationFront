const SERVER_URL = "http://localhost:8080/api/cars"

import {paginator} from "../../lib/paginator/paginate.js";
import { sanitizeStringWithTableRows } from "../../utils.js";
const SIZE = 10
const TOTAL_RECORDS = 1000 //Should come from the backend
const TOTAL = Math.ceil(TOTAL_RECORDS / SIZE)

let cars = [];

//If not used with Navigo, just leave out match
export async function load(pg, match) {
    const p = match?.params?.page || pg  //To support Navigo
    let pageNo = Number(p)
    let queryString = `?size=${SIZE}&page=${pageNo}`
    try {
        cars = await fetch(`${SERVER_URL}${queryString}`)
            .then(res => res.json())
    } catch (e) {
        console.error(e)
    }
    const rows = cars.map(car => `
  <tr>
    <td>${car.brand}</td>
    <td>${car.model}</td>
    <td>${car.color}</td>
    <td>${car.kilometers}</td>
  </tr>`).join("");

    // DON'T forget to sanitize the string before inserting it into the DOM
    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(rows)


    // (C1-2) REDRAW PAGINATION
    paginator({
        target: document.getElementById("car-paginator"),
        total: TOTAL,
        current: pageNo,
        click: load
    });

}
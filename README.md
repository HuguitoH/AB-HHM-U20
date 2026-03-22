
# **Fuel Price Analyzer - Unit 20**

A command-line tool that fetches and process fuel prices data from Spain's Ministry of Ecological Transition REST API, generating daily reports and market intelligence for a fuel distribution company. 

---

## **Table of Contents**

1. [Scenario](#scenario)
2. [Requirements](#requirements)
3. [Installation](#install)
4. [Usage](#Usage)
5. [Data Source](#data)
6. [Architecture](#architecture)
7. [Project Structure](#project-structure)
8. [Testing](#test)
9. [References](#references)

---

## **Scenario**

This project is developed for the IT department of a fuel distribution company that operates several services across Spain. The company requires software to process fuel prices data published by the *`Ministerio para la Transición Ecologica y el Reto Demográfico`*, in order to support pricing policy decisions and market analysis. 

The company has presence in teh following provinces and fuel types: 

| Province | Province ID |
| -------- | ----------- |
| Madrid   | 28          |
| A Coruña | 15          |
| Tenerife | 38          |
| Badajoz  | 06          |


| Fuel               | Product ID |
| ------------------ | ---------- |
| Gasolina 95 E5     | 1          |
| Gasóleo A habitual | 4          |



The software is delivered in three milestones:

- **Milestone 1** — Fetch and parse fuel price data from the API into typed
  data structures.
- **Milestone 2** — Generate a daily report with average prices and top 5
  cheapest/most expensive stations per fuel and province.
- **Milestone 3** — Generate bar charts showing average prices per day of
  the week over the last month.

---
# AstroBeat

## Astronaut Health Monitoring System

[🚀 Try the live prototype](https://monsserratt.github.io/Astro_Beat/)

AstroBeat is a prototype developed for the **NASA Space Apps Challenge 2026** under the challenge:

> **Create Health Monitoring Software for Astronauts on Space Missions**

It supports astronaut health monitoring during long-duration space missions, particularly when communication with Earth is delayed or unavailable.

## The Problem

During space missions, astronauts face:

* Communication delays with Earth.
* Isolation and limited access to immediate assistance.
* Physical symptoms like dizziness, fever, hypothermia, and fatigue.
* Environmental fluctuations (pressure, CO₂, oxygen).
* Decreased strength and aerobic capacity.
* Physical and mental risks tied to the space environment.

In an emergency, waiting for instructions from Mission Control takes too long. Astronauts need clear, actionable data directly from their devices.

## Our Solution

AstroBeat cross-references physiological and environmental data to:

* Detect health anomalies.
* Identify critical situations requiring immediate attention.
* Display simple, prioritized recommendations.
* Trigger audio alerts.
* Provide emergency response protocols.
* Operate fully offline during communication blackouts.
* Log events for synchronization once connectivity is restored.

AstroBeat serves as a decision-support tool during the critical first moments of an emergency.

## Core Features

### Health Monitoring

The prototype simulates tracking of:

* Heart rate
* Heart rate variability (HRV)
* Blood oxygen saturation (SpO₂)
* Body temperature
* Skin temperature
* Blood pressure
* Glucose levels
* Self-reported dizziness

### Environmental Monitoring

It also tracks spacecraft cabin variables:

* CO₂ concentration
* Cabin pressure
* Radiation levels
* Potential depressurization indicators

### Alerts and Protocols

The system recognizes emergency scenarios, including:

* Severe dizziness
* Fever
* Hypothermia
* Depressurization
* Elevated CO₂
* Low oxygen saturation
* Cardiovascular anomalies

Each scenario triggers prioritized information, helping the astronaut understand the situation and take immediate action.

### Offline Functionality

During Mission Control communication blackouts:

* AstroBeat processes data locally.
* Alerts remain active.
* Events are logged on the device.
* Data queues for synchronization and is sent to MCC once the connection is restored.

## Simulated Scenarios

The prototype features pre-configured test scenarios:

* **E1:** Stable state
* **E2:** Cardiovascular anomaly
* **E3:** Potential depressurization
* **E4:** Elevated CO₂ concentration
* **E5:** Severe dizziness
* **E6:** Critical fever
* **E7:** Critical hypothermia

*Note: These are mock scenarios for demonstration purposes.*

## Hardware Vision

The full AstroBeat concept involves:

1. Physiological and environmental sensors.
2. A low-power wearable device.
3. Local edge processing.
4. Automated alerts and protocols.
5. Asynchronous MCC synchronization.

Future iterations aim to integrate these sensors into a flexible, biocompatible smart patch that transmits data to the wearable via body-area networks.

## How to Run the Prototype

1. Download or clone this repository.
2. Open `astrobeat-watch.html` in any web browser.
3. Or try the live version via GitHub Pages:
**[Open AstroBeat](https://monsserratt.github.io/Astro_Beat/)**

## Project Status

AstroBeat is a functional prototype built for educational, demonstration, and initial research purposes.

Currently:

* Hardware sensors are simulated.
* Physiological data is mock-generated.
* MCC communication is simulated.
* Medical protocols require aerospace validation.
* The system is not certified for clinical use or spaceflight.

## Limitations

AstroBeat is not a certified medical device and should not be used to diagnose, treat, or prevent any disease.

Real-world implementation requires:

* Medical specialist validation.
* Hardware sensor integration.
* Accuracy and reliability testing.
* Space analog environment trials.
* Human factors assessment.
* Aerospace compliance and certification.

## Team

Developed by:
* Michelle Alexandra Gutiérrez Cortes
* Monsserratt Gutiérrez Ruvalcaba
* Vanessa Araceli Montoya Pizarro

Created for the **NASA Space Apps Challenge 2026**.

## License

This project is presented as an educational and research prototype. All medical information was taken from public information on the NASA website.

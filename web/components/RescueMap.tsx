"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { api } from "@/lib/client";
import type { FoodBank, PublicUser } from "@/lib/types";

type Pin = {
  id: string;
  name: string;
  detail: string;
  lat: number;
  lng: number;
  kind: "bank" | "you";
};

function dot(color: string) {
  return L.divIcon({
    className: "rescue-pin",
    html: `<span style="display:block;width:18px;height:18px;border-radius:999px;background:${color};border:3px solid #fffdf8;box-shadow:0 2px 8px rgba(15,40,28,.45)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  });
}

const bankIcon = dot("#143528");
const youIcon = dot("#c45c26");

export default function RescueMap() {
  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      api<{ foodBanks: FoodBank[] }>("/api/food-banks"),
      api<{ user: PublicUser }>("/api/auth/me"),
    ])
      .then(([banks, me]) => {
        if (!active) return;
        const you = me.user;
        setPins([
          {
            id: you.id,
            name: you.organization,
            detail: `${you.name} · your sign-in location`,
            lat: you.lat,
            lng: you.lng,
            kind: "you",
          },
          ...banks.foodBanks.map((bank) => ({
            id: bank.id,
            name: bank.name,
            detail: `${bank.remainingCapacityKg} kg left · ${bank.deliveryRangeKm} km range`,
            lat: bank.lat,
            lng: bank.lng,
            kind: "bank" as const,
          })),
        ]);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const center = useMemo<[number, number]>(() => {
    const first = pins[0];
    return first ? [first.lat, first.lng] : [13.75, 100.52];
  }, [pins]);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-forest">Bangkok rescue map</p>
          <p className="text-sm text-muted">Green pins are food banks. The orange pin is you. Open any pin in Google Maps.</p>
        </div>
      </div>
      <MapContainer key={pins.map((pin) => pin.id).join("-") || "bangkok"} center={center} zoom={11} scrollWheelZoom={false} className="rescue-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pins.map((pin) => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={pin.kind === "you" ? youIcon : bankIcon}>
            <Popup>
              <strong>{pin.name}</strong>
              <br />
              {pin.detail}
              <br />
              <a href={`https://www.google.com/maps?q=${pin.lat},${pin.lng}`} target="_blank" rel="noreferrer">
                Open in Google Maps
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

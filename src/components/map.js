import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const [nodes, setNodes] = useState([]);

  // Fetch and filter nodes for btc-isla
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

useEffect(() => {
  const fetchNodes = async () => {
    let allNodes = []; // Array to store all fetched nodes
    let currentPage = 1; // Start with page 1
    const pageSize = 50; // Number of items per page
    let hasMorePages = true;

    try {
      while (hasMorePages) {
        // Make the API request with delay
        console.log(`Fetching page ${currentPage}...`);
        const response = await axios.get(
          `https://api.btcmap.org/v2/elements?page=${currentPage}&limit=${pageSize}`
        );

        const nodes = response.data;

        if (nodes.length > 0) {
          allNodes = [...allNodes, ...nodes]; // Append fetched nodes
          currentPage += 1; // Move to the next page
          await delay(1000); // Wait 1 second before the next request
        } else if(!nodes || nodes.length == 0)  {
          hasMorePages = false; // Stop if no more results
        }
      }

      // Filter nodes where tags.areas contains url_alias "btc-isla"
      const filteredNodes = allNodes.filter((node) =>
        node.tags?.areas?.some((area) => area.url_alias === 'btc-isla')
      );

      // Format nodes for Leaflet markers
      const formattedNodes = filteredNodes
        .map((node) => {
          const lat = node.osm_json?.lat;
          const lon = node.osm_json?.lon;
          if (!lat || !lon) return null; // Skip invalid coordinates
          return {
            id: node.id,
            name: node.osm_json?.tags?.name || 'Unknown',
            latitude: lat,
            longitude: lon,
            category: node.tags?.category || 'Other',
            website: node.osm_json?.tags?.website || null,
            phone: node.osm_json?.tags?.phone || null,
          };
        })
        .filter((node) => node !== null);

      setNodes(formattedNodes); // Update state
    } catch (error) {
      console.error('Error fetching nodes:', error.message);
    }
  };

  fetchNodes();
}, []);

  
  useEffect(() => {
    console.log('Final Nodes:', nodes); // Log when nodes state changes
  }, [nodes]); // Runs whenever nodes is updated

  return (
    <div>
      <h1>Bitcoin Map of Isla Mujeres</h1>
      <MapContainer center={[21.2322, -86.7314]} zoom={14} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Render Markers */}
        {nodes.map((node) => (
          <Marker key={node.id} position={[node.latitude, node.longitude]}>
            <Popup>
              <strong>{node.name}</strong>
              <br />
              Category: {node.category}
              <br />
              {node.website && (
                <>
                  Website: <a href={node.website} target="_blank" rel="noopener noreferrer">{node.website}</a>
                  <br />
                </>
              )}
              {node.phone && `Phone: ${node.phone}`}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

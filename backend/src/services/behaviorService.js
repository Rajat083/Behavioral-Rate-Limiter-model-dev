const EPSILON = 1e-6;

function toProtocolNumber(protocolRaw) {
  if (typeof protocolRaw === 'number') {
    return protocolRaw;
  }

  const value = String(protocolRaw || '').trim().toLowerCase();

  if (value === 'tcp') return 6;
  if (value === 'udp') return 17;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 6;
}

function mean(values) {
  if (!values.length) return 0;
  const total = values.reduce((acc, current) => acc + current, 0);
  return total / values.length;
}

function stddev(values, avg) {
  if (values.length < 2) return 0;
  const variance = values.reduce((acc, current) => acc + (current - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function computeInterArrivalTimes(events) {
  if (events.length < 2) return [];

  const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);
  const iats = [];

  for (let i = 1; i < sorted.length; i += 1) {
    iats.push(Math.max(0, sorted[i].timestamp - sorted[i - 1].timestamp));
  }

  return iats;
}

function computeBehaviorFeatures(events) {
  if (!events.length) {
    return {
      flow_iat_mean: 0,
      flow_iat_std: 0,
      iat_cv: 0,
      flow_duration: 0,
      packet_length_std: 0,
      avg_packet_size: 0,
      total_fwd_packets: 0,
      down_up_ratio: 0,
      protocol: 6,
    };
  }

  const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);
  const iats = computeInterArrivalTimes(sorted);
  const flowIatMean = mean(iats);
  const flowIatStd = stddev(iats, flowIatMean);

  const packetSizes = sorted.map((e) => Number.isFinite(e.payloadBytes) ? e.payloadBytes : 0);
  const avgPacketSize = mean(packetSizes);
  const packetLengthStd = stddev(packetSizes, avgPacketSize);

  const totalUp = sorted.reduce((acc, e) => acc + (Number.isFinite(e.payloadBytes) ? e.payloadBytes : 0), 0);
  const totalDown = sorted.reduce((acc, e) => acc + (Number.isFinite(e.responseBytes) ? e.responseBytes : 0), 0);

  return {
    flow_iat_mean: flowIatMean,
    flow_iat_std: flowIatStd,
    iat_cv: flowIatStd / (flowIatMean + EPSILON),
    flow_duration: Math.max(0, sorted[sorted.length - 1].timestamp - sorted[0].timestamp),
    packet_length_std: packetLengthStd,
    avg_packet_size: avgPacketSize,
    total_fwd_packets: sorted.length,
    down_up_ratio: totalUp > 0 ? totalDown / totalUp : 0,
    protocol: toProtocolNumber(sorted[sorted.length - 1].protocol),
  };
}

module.exports = {
  computeBehaviorFeatures,
};

import { useState, useEffect } from "react";
import { useComposeDB } from "../../hooks/useComposeDB";

export default function Leaderboard() {
  const { compose } = useComposeDB();

  const [leaders, setLeaders] = useState([]);
  async function loadLeaders() {
    const pins = await compose.executeQuery(`
    query {
      pinIndex(first:100) {
        edges {
          node {
            id
            author {id}
          }
        }
      }
    }`);
    console.log(pins);

    const counts = pins.data.pinIndex.edges
      .map((edge) => edge.node)
      .reduce((acc, pin) => {
        if (!(pin.author.id in acc)) {
          acc[pin.author.id] = 0;
        }
        acc[pin.author.id] += 1;
        return acc;
      }, {});

    console.log(counts);
    setLeaders(
      Object.keys(counts)
        .map((k) => ({ author: k, count: counts[k] }))
        .sort((a, b) => b.count - a.count)
    );
  }

  function getLeaders() {
    useEffect(() => {
      loadLeaders();
    }, []);

    return leaders;
  }

  const leaderComponents = getLeaders();

  return (
    <ol>
      {leaderComponents.map((leader) => (
        <li>
          <strong>{leader.count}</strong> {leader.author}
        </li>
      ))}
    </ol>
  );
}

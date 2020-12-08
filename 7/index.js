class BagGraph {
  constructor() {
    this.nodes = new Map()
  }

  filter(iterator) {
    return [...this.nodes].filter(iterator)
  }

  addNode(node) {
    if (!this.nodes.has(node)) {
      this.nodes.set(node, new Map())
    }
  }

  addEdge(node1, node2, value) {
    this.addNode(node1)
    this.addNode(node2)
    this.nodes.get(node1).set(node2, value)
  }

  pathContains(start, stop) {
    const children = this.nodes.get(start)

    for (const [child] of children) {
      const res = this.pathContains(child, stop)
      if (res) return true
    }

    return children.has(stop)
  }

  countContaining(start, pathTotal = 0) {
    const children = this.nodes.get(start)

    let result = pathTotal
    for (const [child, count] of children) {
      result += this.countContaining(child, (pathTotal || 1) * count)
    }

    return result
  }
}

const parseBags = (lines) => {
  const graph = new BagGraph()

  lines.forEach((line) => {
    const [outerBag, innerBags] = line
      .replace(/\s?bags?\.?/g, "")
      .split("contain")
      .map((t) => t.trim())

    if (innerBags !== "no other") {
      innerBags.split(",").forEach((bag) => {
        const [, count, innerBag] =
          bag.trim().match(/^(\d+)\s([a-z\s]*)$/) || []
        graph.addEdge(outerBag, innerBag, count)
      })
    }
  })

  return graph
}

const MY_BAG = "shiny gold"

const problem1 = (lines) => {
  const bags = parseBags(lines)
  return bags.filter(([key]) => bags.pathContains(key, MY_BAG)).length
}

const problem2 = (lines) => {
  const bags = parseBags(lines)
  return bags.countContaining(MY_BAG)
}

module.exports = [problem1, problem2]

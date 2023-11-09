const groupBy = <T>(list: T[], callback: (item: T) => string): Record<string, T[]> => {
  const groups: Record<string, T[]> = {}

  if (Array.isArray(list)) {
    list.forEach(item => {
      const key = callback(item)

      if (!Array.isArray(groups[key])) {
        groups[key] = []
      }

      groups[key].push(item)
    })
  }

  return groups
}

export { groupBy }

class Person {
  speak (name?: string): string {
    return `Olá ${name?.toUpperCase() ?? 'Foo'}!!!`
  }
}

const p = new Person()
p.speak()
p.speak()

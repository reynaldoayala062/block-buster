# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.create(name: "rey")
User.create(name: "Ed")
User.create(name: "John")
HighScore.create(score: 10, user_id: 1)
HighScore.create(score: 30, user_id: 2)
HighScore.create(score: 50, user_id: 3)
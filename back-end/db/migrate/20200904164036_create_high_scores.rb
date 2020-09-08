class CreateHighScores < ActiveRecord::Migration[6.0]
  def change
    create_table :high_scores do |t|
      t.integer :score
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end

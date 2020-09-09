class CreateHighScores < ActiveRecord::Migration[6.0]
  def change
    create_table :high_scores do |t|
      t.integer :score
      t.integer :user_id

      t.timestamps
    end
  end
end

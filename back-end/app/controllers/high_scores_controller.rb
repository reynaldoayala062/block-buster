class HighScoresController < ApplicationController

    def index

        @high_scores = HighScore.all

        render json: @high_scores, include: :user

    end

    def create
        @high_score = HighScore.create(high_score_params)
    end

    private

    def high_score_params
        params.require(:user).permit(:score, :user_id)
    end
end

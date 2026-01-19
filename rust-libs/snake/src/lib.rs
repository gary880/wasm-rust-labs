use wasm_bindgen::prelude::*;
use rand::Rng;

#[wasm_bindgen]
#[derive(PartialEq, Clone, Copy, Debug)]
pub enum Direction {
    Up,
    Down,
    Left,
    Right,
}

#[derive(Clone, Copy, PartialEq, Debug)]
struct Point {
    x: u32,
    y: u32,
}

#[wasm_bindgen]
pub struct SnakeGame {
    width: u32,
    height: u32,
    snake: Vec<Point>,
    direction: Direction,
    next_direction: Direction, // Add next_direction to prevent 180 turns in one tick
    food: Point,
    score: u32,
    game_over: bool,
}

#[wasm_bindgen]
impl SnakeGame {
    pub fn new(width: u32, height: u32) -> SnakeGame {
        let snake = vec![
            Point { x: 10, y: 8 },
            Point { x: 9, y: 8 },
            Point { x: 8, y: 8 },
        ];
        
        let mut game = SnakeGame {
            width,
            height,
            snake,
            direction: Direction::Right,
            next_direction: Direction::Right,
            food: Point { x: 0, y: 0 },
            score: 0,
            game_over: false,
        };
        
        game.spawn_food();
        game
    }

    pub fn tick(&mut self) {
        if self.game_over {
            return;
        }

        self.direction = self.next_direction;
        let head = self.snake[0];
        
        let (next_x, next_y) = match self.direction {
            Direction::Up => (head.x as i32, head.y as i32 - 1),
            Direction::Down => (head.x as i32, head.y as i32 + 1),
            Direction::Left => (head.x as i32 - 1, head.y as i32),
            Direction::Right => (head.x as i32 + 1, head.y as i32),
        };

        // Check boundary collision
        if next_x < 0 || next_y < 0 || next_x >= self.width as i32 || next_y >= self.height as i32 {
            self.game_over = true;
            return;
        }

        let next_head = Point { x: next_x as u32, y: next_y as u32 };

        // Check self collision
        if self.snake.contains(&next_head) {
            self.game_over = true;
            return;
        }

        self.snake.insert(0, next_head);

        if next_head == self.food {
            self.score += 1;
            self.spawn_food();
        } else {
            self.snake.pop();
        }
    }

    pub fn change_direction(&mut self, dir: Direction) {
        if self.game_over { return; }
        
        // Prevent reversing directly
        let opposite = match self.direction {
            Direction::Up => Direction::Down,
            Direction::Down => Direction::Up,
            Direction::Left => Direction::Right,
            Direction::Right => Direction::Left,
        };

        if dir != opposite {
            self.next_direction = dir;
        }
    }

    fn spawn_food(&mut self) {
        let mut rng = rand::thread_rng();
        loop {
            let new_food = Point {
                x: rng.gen_range(0..self.width),
                y: rng.gen_range(0..self.height),
            };
            if !self.snake.contains(&new_food) {
                self.food = new_food;
                break;
            }
        }
    }

    // Getters
    
    // Returns a flat array of [x1, y1, x2, y2, ...]
    pub fn get_snake_cells(&self) -> Vec<u32> {
        self.snake.iter().flat_map(|p| vec![p.x, p.y]).collect()
    }

    pub fn food_x(&self) -> u32 {
        self.food.x
    }

    pub fn food_y(&self) -> u32 {
        self.food.y
    }
    
    pub fn is_game_over(&self) -> bool {
        self.game_over
    }

    pub fn get_score(&self) -> u32 {
        self.score
    }
    
    pub fn get_width(&self) -> u32 {
        self.width
    }
    
    pub fn get_height(&self) -> u32 {
        self.height
    }
}

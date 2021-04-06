# Library that will help wrangling process for the data.
# Allows to use methods and pipeline procedure '%>%'
library(tidyverse)

# Reading in original form of data.
original_form <- read.csv("top250-00-19.csv")
# Previewing beginning form
head(original_form)

# Wrangled data to be visualised.
visu_data <- original_form %>%
  mutate(Position = as.factor(Position)) %>% # Turning the factors to factors.
  mutate(Age = as.factor(Age)) %>%
  mutate(Season = as.factor(Season)) %>%
  mutate(League_to = as.factor(League_to)) %>%
  filter(League_to %in% c("LaLiga", # Keeping only top 5 leagues to compare.
                      "Serie A",
                      "Premier League",
                      "1.Bundesliga",
                      "Ligue 1")) %>%
  select(Name,  # Keeping only columns interested in.
         Position,
         Age,
         Season,
         Transfer_fee,
         League_to)

# Saving the dataframe to a csv file
write.csv(visu_data,'updated_data.csv')

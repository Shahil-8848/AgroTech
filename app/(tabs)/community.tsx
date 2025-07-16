import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Heart, MessageCircle, Share, User, Clock, Bookmark, TrendingUp, CircleHelp as HelpCircle, Lightbulb } from 'lucide-react-native';

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState('feed');

  const tabs = [
    { id: 'feed', title: 'Feed', icon: TrendingUp },
    { id: 'questions', title: 'Q&A', icon: HelpCircle },
    { id: 'tips', title: 'Tips', icon: Lightbulb },
  ];

  const posts = [
    {
      id: 1,
      author: 'Ramesh Patil',
      role: 'Farmer',
      time: '2 hours ago',
      content: 'Just finished harvesting my wheat crop! The yield this year is exceptional thanks to the new irrigation system. Any tips for storing wheat to prevent pest damage?',
      likes: 24,
      comments: 8,
      saved: false,
      type: 'text'
    },
    {
      id: 2,
      author: 'Dr. Priya Sharma',
      role: 'Agricultural Expert',
      time: '4 hours ago',
      content: 'Organic farming tip: Use neem oil spray as a natural pesticide. It\'s effective against aphids and doesn\'t harm beneficial insects. Best applied in the evening.',
      likes: 56,
      comments: 12,
      saved: true,
      type: 'tip'
    },
    {
      id: 3,
      author: 'Suresh Kumar',
      role: 'Contractor',
      time: '6 hours ago',
      content: 'My new harvester is available for booking in Nashik district. Special rates for small farmers. DM me for details!',
      likes: 18,
      comments: 5,
      saved: false,
      type: 'service'
    },
    {
      id: 4,
      author: 'Anita Rao',
      role: 'Farmer',
      time: '1 day ago',
      content: 'Question: What\'s the best time to plant tomatoes in Maharashtra? I\'m planning to start a kitchen garden.',
      likes: 32,
      comments: 15,
      saved: false,
      type: 'question'
    },
  ];

  const questions = [
    {
      id: 1,
      question: 'What is the best fertilizer for wheat crop?',
      author: 'Mukesh Gupta',
      time: '3 hours ago',
      answers: 5,
      views: 123,
    },
    {
      id: 2,
      question: 'How to prevent fungal diseases in monsoon?',
      author: 'Kavita Sharma',
      time: '5 hours ago',
      answers: 8,
      views: 245,
    },
    {
      id: 3,
      question: 'Organic vs chemical fertilizers - which is better?',
      author: 'Ravi Patel',
      time: '1 day ago',
      answers: 12,
      views: 456,
    },
  ];

  const tips = [
    {
      id: 1,
      title: 'Water Conservation Techniques',
      content: 'Drip irrigation can save up to 50% water compared to traditional methods.',
      author: 'Dr. Rajesh Mehta',
      time: '2 days ago',
      likes: 78,
    },
    {
      id: 2,
      title: 'Soil Health Management',
      content: 'Regular soil testing helps maintain optimal pH levels for better crop yield.',
      author: 'Priya Aggarwal',
      time: '3 days ago',
      likes: 64,
    },
    {
      id: 3,
      title: 'Pest Control Strategy',
      content: 'Integrated pest management combines biological, cultural, and chemical methods.',
      author: 'Dr. Vinod Singh',
      time: '4 days ago',
      likes: 89,
    },
  ];

  const renderPost = (post: any) => (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <View style={styles.avatar}>
            <User size={20} color="#6B7280" />
          </View>
          <View>
            <Text style={styles.authorName}>{post.author}</Text>
            <View style={styles.postMeta}>
              <Text style={styles.authorRole}>{post.role}</Text>
              <Text style={styles.separator}>•</Text>
              <Clock size={12} color="#6B7280" />
              <Text style={styles.postTime}>{post.time}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity>
          <Bookmark size={20} color={post.saved ? '#22C55E' : '#6B7280'} fill={post.saved ? '#22C55E' : 'none'} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.postContent}>{post.content}</Text>
      
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Heart size={16} color="#6B7280" />
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={16} color="#6B7280" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Share size={16} color="#6B7280" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderQuestion = (question: any) => (
    <TouchableOpacity key={question.id} style={styles.questionCard}>
      <Text style={styles.questionTitle}>{question.question}</Text>
      <View style={styles.questionMeta}>
        <Text style={styles.questionAuthor}>Asked by {question.author}</Text>
        <Text style={styles.separator}>•</Text>
        <Text style={styles.questionTime}>{question.time}</Text>
      </View>
      <View style={styles.questionStats}>
        <Text style={styles.questionStat}>{question.answers} answers</Text>
        <Text style={styles.questionStat}>{question.views} views</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTip = (tip: any) => (
    <View key={tip.id} style={styles.tipCard}>
      <Text style={styles.tipTitle}>{tip.title}</Text>
      <Text style={styles.tipContent}>{tip.content}</Text>
      <View style={styles.tipFooter}>
        <Text style={styles.tipAuthor}>by {tip.author}</Text>
        <Text style={styles.separator}>•</Text>
        <Text style={styles.tipTime}>{tip.time}</Text>
        <View style={styles.tipLikes}>
          <Heart size={12} color="#6B7280" />
          <Text style={styles.tipLikeCount}>{tip.likes}</Text>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return posts.map(renderPost);
      case 'questions':
        return questions.map(renderQuestion);
      case 'tips':
        return tips.map(renderTip);
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              activeTab === tab.id && styles.activeTabButton
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <tab.icon
              size={16}
              color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'}
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#A4D65E',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeTabButton: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  authorRole: {
    fontSize: 12,
    color: '#6B7280',
  },
  separator: {
    fontSize: 12,
    color: '#6B7280',
  },
  postTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  postContent: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  questionAuthor: {
    fontSize: 12,
    color: '#6B7280',
  },
  questionTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  questionStats: {
    flexDirection: 'row',
    gap: 16,
  },
  questionStat: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '500',
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  tipContent: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 12,
  },
  tipFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tipAuthor: {
    fontSize: 12,
    color: '#6B7280',
  },
  tipTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  tipLikes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  tipLikeCount: {
    fontSize: 12,
    color: '#6B7280',
  },
});